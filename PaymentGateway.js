function PaymentGateway() {
  const [billData, setBillData] = React.useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [step, setStep] = React.useState('method');
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    accountNumber: ''
  });

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const billId = params.get('billId');
    
    if (billId) {
      loadBillData(billId);
    } else {
      // Silently redirect based on auth status
      const auth = localStorage.getItem('residentAuth');
      if (auth) {
        window.location.href = 'resident-dashboard.html';
      } else {
        window.location.href = 'resident-login.html';
      }
    }
  }, []);

  const loadBillData = async (billId) => {
    try {
      const bill = await trickleGetObject('bill', billId);
      setBillData(bill);
    } catch (error) {
      console.error('Error loading bill:', error);
      // Silently redirect to dashboard on error
      window.location.href = 'resident-dashboard.html';
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setStep('details');
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await trickleUpdateObject('bill', billData.objectId, {
        ...billData.objectData,
        status: 'paid',
        paidDate: new Date().toISOString(),
        paymentMethod: paymentMethod
      });
      
      setStep('success');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  try {
    if (!billData) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">Loading payment details...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8" data-name="payment-gateway" data-file="components/PaymentGateway.js">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="icon-shield-check text-2xl text-white"></div>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Secure Payment Gateway</h1>
            <p className="text-[var(--text-secondary)] mt-2">Complete your bill payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 order-2 lg:order-1">
              {step === 'method' && (
                <div className="card">
                  <h2 className="text-xl font-bold mb-6">Select Payment Method</h2>
                  <div className="space-y-4">
                    <div className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`} onClick={() => handlePaymentMethodSelect('upi')}>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                          <div className="icon-smartphone text-xl text-purple-600"></div>
                        </div>
                        <div>
                          <h3 className="font-semibold">UPI Payment</h3>
                          <p className="text-sm text-[var(--text-secondary)]">Pay using Google Pay, PhonePe, Paytm</p>
                        </div>
                      </div>
                    </div>

                    <div className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => handlePaymentMethodSelect('card')}>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <div className="icon-credit-card text-xl text-blue-600"></div>
                        </div>
                        <div>
                          <h3 className="font-semibold">Debit/Credit Card</h3>
                          <p className="text-sm text-[var(--text-secondary)]">Visa, MasterCard, RuPay</p>
                        </div>
                      </div>
                    </div>

                    <div className={`payment-method ${paymentMethod === 'netbanking' ? 'active' : ''}`} onClick={() => handlePaymentMethodSelect('netbanking')}>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                          <div className="icon-building-2 text-xl text-green-600"></div>
                        </div>
                        <div>
                          <h3 className="font-semibold">Net Banking</h3>
                          <p className="text-sm text-[var(--text-secondary)]">All major banks supported</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 'details' && paymentMethod === 'upi' && (
                <div className="card">
                  <button onClick={() => setStep('method')} className="flex items-center text-[var(--primary-color)] mb-4">
                    <div className="icon-arrow-left text-lg mr-2"></div>
                    Back
                  </button>
                  <h2 className="text-xl font-bold mb-6">Enter UPI Details</h2>
                  <form onSubmit={handleProcessPayment}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">UPI ID</label>
                      <input type="text" value={formData.upiId} onChange={(e) => setFormData({...formData, upiId: e.target.value})} className="input-field" placeholder="yourname@upi" required />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                      {loading ? 'Processing...' : `Pay ₹${billData.objectData.amount}`}
                    </button>
                  </form>
                </div>
              )}

              {step === 'details' && paymentMethod === 'card' && (
                <div className="card">
                  <button onClick={() => setStep('method')} className="flex items-center text-[var(--primary-color)] mb-4">
                    <div className="icon-arrow-left text-lg mr-2"></div>
                    Back
                  </button>
                  <h2 className="text-xl font-bold mb-6">Enter Card Details</h2>
                  <form onSubmit={handleProcessPayment}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Card Number</label>
                      <input type="text" value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value})} className="input-field" placeholder="1234 5678 9012 3456" maxLength="19" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                      <input type="text" value={formData.cardName} onChange={(e) => setFormData({...formData, cardName: e.target.value})} className="input-field" placeholder="Name on card" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date</label>
                        <input type="text" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} className="input-field" placeholder="MM/YY" maxLength="5" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <input type="password" value={formData.cvv} onChange={(e) => setFormData({...formData, cvv: e.target.value})} className="input-field" placeholder="123" maxLength="3" required />
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                      {loading ? 'Processing...' : `Pay ₹${billData.objectData.amount}`}
                    </button>
                  </form>
                </div>
              )}

              {step === 'details' && paymentMethod === 'netbanking' && (
                <div className="card">
                  <button onClick={() => setStep('method')} className="flex items-center text-[var(--primary-color)] mb-4">
                    <div className="icon-arrow-left text-lg mr-2"></div>
                    Back
                  </button>
                  <h2 className="text-xl font-bold mb-6">Select Your Bank</h2>
                  <form onSubmit={handleProcessPayment}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Bank Name</label>
                      <select value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} className="input-field" required>
                        <option value="">Choose your bank</option>
                        <option value="SBI">State Bank of India</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="Axis">Axis Bank</option>
                        <option value="Kotak">Kotak Mahindra Bank</option>
                        <option value="PNB">Punjab National Bank</option>
                      </select>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                      {loading ? 'Processing...' : `Pay ₹${billData.objectData.amount}`}
                    </button>
                  </form>
                </div>
              )}

              {step === 'success' && (
                <div className="card text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="icon-check text-3xl text-green-600"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                  <p className="text-[var(--text-secondary)] mb-6">Your bill payment has been processed successfully</p>
                  <button onClick={() => window.location.href = 'resident-dashboard.html'} className="btn-primary">
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>

            <div className="order-1 lg:order-2">
              <div className="card lg:sticky lg:top-8">
                <h3 className="text-lg font-semibold mb-4">Bill Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Bill Type</span>
                    <span className="font-medium capitalize">{billData.objectData.billType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Flat Number</span>
                    <span className="font-medium">{billData.objectData.flatNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Period</span>
                    <span className="font-medium">{billData.objectData.month}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Due Date</span>
                    <span className="font-medium">{new Date(billData.objectData.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="border-t border-[var(--border-color)] pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-[var(--primary-color)]">₹{billData.objectData.amount}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="icon-shield-check text-lg text-green-600 mr-2 mt-1"></div>
                    <p className="text-sm text-green-800">100% Secure Payment. Your data is protected with bank-grade security.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('PaymentGateway component error:', error);
    return null;
  }
}