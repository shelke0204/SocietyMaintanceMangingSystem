function PremiumPayment() {
  const [billData, setBillData] = React.useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState('upi');
  const [step, setStep] = React.useState('payment');
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('pending');
  const [transactionData, setTransactionData] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const billId = params.get('billId');
    
    if (billId) {
      loadBillData(billId);
    } else {
      window.location.href = 'resident-dashboard.html';
    }
  }, []);

  const loadBillData = async (billId) => {
    try {
      const bill = await trickleGetObject('bill', billId);
      const auth = JSON.parse(localStorage.getItem('residentAuth') || '{}');
      setBillData({ 
        ...bill, 
        residentName: auth.name, 
        flatNumber: auth.flatNumber,
        building: auth.building
      });
    } catch (error) {
      console.error('Error loading bill:', error);
      window.location.href = 'resident-dashboard.html';
    }
  };

  const completePayment = async (txnId) => {
    setLoading(true);
    setStatus('processing');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionRef = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const paymentData = {
        transactionId: txnId || transactionRef,
        amount: billData.objectData.amount,
        paymentMethod: paymentMethod,
        timestamp: new Date().toISOString(),
        status: 'paid'
      };
      
      await trickleUpdateObject('bill', billData.objectId, {
        ...billData.objectData,
        status: 'paid',
        paidDate: paymentData.timestamp,
        transactionId: paymentData.transactionId,
        paymentMethod: paymentData.paymentMethod
      });
      
      setTransactionData(paymentData);
      setStatus('paid');
      setStep('success');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment verification failed. Please try again.');
      setStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  if (!billData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading Payment Details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" data-name="premium-payment" data-file="components/PremiumPayment.js">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => window.location.href = 'resident-dashboard.html'} 
          className="text-yellow-400 hover:text-yellow-300 mb-6 flex items-center font-medium transition-colors"
        >
          <span className="icon-arrow-left text-lg mr-2"></span>
          Back to Dashboard
        </button>

        {step === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in">
            <div className="lg:col-span-2 space-y-6">
              <PaymentMethodSelector method={paymentMethod} setMethod={setPaymentMethod} />
              
              {paymentMethod === 'upi' && (
                <UPIPaymentSection 
                  amount={billData.objectData.amount}
                  billId={billData.objectId}
                  onPaymentComplete={completePayment}
                  loading={loading}
                  status={status}
                />
              )}
              
              {paymentMethod === 'card' && (
                <CardPaymentForm 
                  amount={billData.objectData.amount}
                  onPaymentComplete={completePayment}
                  loading={loading}
                />
              )}
              
              {paymentMethod === 'netbanking' && (
                <NetBankingForm 
                  amount={billData.objectData.amount}
                  onPaymentComplete={completePayment}
                  loading={loading}
                />
              )}
            </div>
            
            <BillSummaryCard billData={billData} status={status} />
          </div>
        )}

        {step === 'success' && (
          <SuccessScreen 
            billData={billData} 
            transactionData={transactionData}
          />
        )}
      </div>
    </div>
  );
}
