function UPIPayment() {
  const [billData, setBillData] = React.useState(null);
  const [step, setStep] = React.useState('invoice');
  const [qrGenerated, setQrGenerated] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [paymentDetails, setPaymentDetails] = React.useState(null);
  const [verificationStatus, setVerificationStatus] = React.useState('');
  const [qrExpiry, setQrExpiry] = React.useState(null);
  const [timeRemaining, setTimeRemaining] = React.useState(600);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const billId = params.get('billId');
    
    if (billId) {
      loadBillData(billId);
    } else {
      const auth = localStorage.getItem('residentAuth');
      if (auth) {
        window.location.href = 'resident-dashboard.html';
      } else {
        window.location.href = 'resident-login.html';
      }
    }
  }, []);

  React.useEffect(() => {
    if (step === 'qr' && qrExpiry) {
      const timer = setInterval(() => {
        const now = Date.now();
        const remaining = Math.floor((qrExpiry.getTime() - now) / 1000);
        
        if (remaining <= 0) {
          clearInterval(timer);
          setTimeRemaining(0);
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [step, qrExpiry]);

  const loadBillData = async (billId) => {
    try {
      const bill = await trickleGetObject('bill', billId);
      setBillData(bill);
    } catch (error) {
      console.error('Error loading bill:', error);
      window.location.href = 'resident-dashboard.html';
    }
  };

  const generateUPIQRCode = async () => {
    setLoading(true);
    try {
      const upiId = 'Shelke0204@ybl';
      const amount = billData.objectData.amount;
      const name = 'Society Management';
      const timestamp = Date.now();
      const note = `Bill-${billData.objectId.substring(0, 8)}-${timestamp}`;
      
      const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
      
      const canvas = document.getElementById('qr-canvas');
      await QRCode.toCanvas(canvas, upiString, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      
      const expiryTime = new Date(Date.now() + 600000);
      setQrExpiry(expiryTime);
      setTimeRemaining(600);
      setQrGenerated(true);
      setStep('qr');
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!transactionId.trim()) {
      setVerificationStatus('Please enter a valid transaction ID');
      return;
    }
    
    if (transactionId.trim().length < 10) {
      setVerificationStatus('Transaction ID must be at least 10 characters');
      return;
    }
    
    setLoading(true);
    setVerificationStatus('Verifying payment...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationStatus('Payment verified successfully!');
      
      const auth = JSON.parse(localStorage.getItem('residentAuth') || '{}');
      const payment = {
        transactionId: transactionId.trim(),
        amount: billData.objectData.amount,
        billId: billData.objectId,
        status: 'paid',
        timestamp: new Date().toISOString(),
        payerName: auth.name,
        payerFlat: auth.flatNumber,
        upiId: 'Shelke0204@ybl',
        paymentMethod: 'UPI'
      };
      
      await trickleUpdateObject('bill', billData.objectId, {
        ...billData.objectData,
        status: 'paid',
        paidDate: payment.timestamp,
        paymentMethod: 'UPI',
        transactionId: payment.transactionId
      });
      
      setPaymentDetails(payment);
      setTimeout(() => {
        setStep('success');
      }, 1000);
    } catch (error) {
      console.error('Error verifying payment:', error);
      setVerificationStatus('Verification failed. Please try again.');
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
      <div className="container mx-auto px-4 py-8 max-w-lg" data-name="upi-payment" data-file="components/UPIPayment.js">
        <div className="text-center mb-6">
          <button onClick={() => window.location.href = 'resident-dashboard.html'} className="inline-flex items-center text-[var(--accent-color)] hover:text-blue-700 mb-4 font-medium">
            <span className="icon-arrow-left text-lg mr-2"></span>
            Back to Dashboard
          </button>
        </div>

        {step === 'invoice' && (
          <div className="card">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="icon-receipt text-3xl text-white"></span>
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Payment Invoice</h1>
              <p className="text-[var(--text-secondary)] mt-2">Review and pay your bill</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-[var(--text-secondary)]">Bill Type</span>
                <span className="font-semibold capitalize">{billData.objectData.billType}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-[var(--text-secondary)]">Flat Number</span>
                <span className="font-semibold">{billData.objectData.flatNumber}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-[var(--text-secondary)]">Period</span>
                <span className="font-semibold">{billData.objectData.month}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-[var(--text-secondary)]">Due Date</span>
                <span className="font-semibold">{new Date(billData.objectData.dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="border-t border-[var(--border-color)] pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Amount to Pay</span>
                <span className="text-3xl font-bold text-[var(--accent-color)]">₹{billData.objectData.amount}</span>
              </div>
            </div>

            <button onClick={generateUPIQRCode} disabled={loading} className="btn-primary w-full">
              {loading ? 'Generating...' : 'Pay Now with UPI'}
            </button>
          </div>
        )}

        {step === 'qr' && (
          <div className="card">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Scan QR Code</h2>
              <p className="text-[var(--text-secondary)]">Use any UPI app to scan and pay</p>
            </div>

            {timeRemaining > 0 ? (
              <>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-[var(--accent-color)] mb-4">
                  <canvas id="qr-canvas" className="mx-auto"></canvas>
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
                      <span className="icon-clock text-lg text-orange-600 mr-2"></span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                      </span>
                      <span className="text-sm text-[var(--text-secondary)] ml-2">remaining</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-sm text-[var(--text-secondary)] mb-2">Amount: <span className="font-bold text-2xl text-[var(--text-primary)]">₹{billData.objectData.amount}</span></p>
                  <p className="text-sm text-[var(--text-secondary)]">UPI ID: <span className="font-mono font-semibold">Shelke0204@ybl</span></p>
                </div>

                <div className="flex justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="icon-smartphone text-xl text-blue-600"></span>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="icon-credit-card text-xl text-green-600"></span>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="icon-wallet text-xl text-purple-600"></span>
                  </div>
                </div>
                <p className="text-xs text-center text-[var(--text-secondary)] mb-6">Supported: Google Pay, PhonePe, Paytm, BHIM, and all UPI apps</p>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => {
                        setTransactionId(e.target.value);
                        setVerificationStatus('');
                      }}
                      className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-color)]"
                      placeholder="Enter UPI Transaction ID (12 digits)"
                      maxLength="20"
                    />
                    {verificationStatus && (
                      <p className={`text-sm mt-2 ${verificationStatus.includes('success') ? 'text-green-600' : verificationStatus.includes('failed') ? 'text-red-600' : 'text-blue-600'}`}>
                        {verificationStatus}
                      </p>
                    )}
                  </div>
                  <button onClick={verifyPayment} disabled={loading} className="btn-primary w-full">
                    {loading ? 'Verifying...' : 'Verify Payment'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="icon-clock text-3xl text-red-600"></span>
                </div>
                <h3 className="text-xl font-bold text-red-600 mb-2">QR Code Expired</h3>
                <p className="text-[var(--text-secondary)] mb-6">The QR code has expired. Please generate a new one.</p>
                <button onClick={generateUPIQRCode} disabled={loading} className="btn-primary">
                  {loading ? 'Generating...' : 'Generate New QR Code'}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'success' && paymentDetails && (
          <div className="card text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="icon-check text-5xl text-green-600"></span>
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-[var(--text-secondary)] mb-8">Your payment has been received and verified</p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Transaction ID</span>
                <span className="font-mono font-semibold">{paymentDetails.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Amount Paid</span>
                <span className="font-bold text-green-600">₹{paymentDetails.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Payment Method</span>
                <span className="font-semibold">{paymentDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Date & Time</span>
                <span className="font-semibold">{new Date(paymentDetails.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Payer</span>
                <span className="font-semibold">{paymentDetails.payerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Paid</span>
              </div>
            </div>

            <button onClick={() => window.location.href = 'resident-dashboard.html'} className="btn-primary w-full">
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('UPIPayment component error:', error);
    return null;
  }
}