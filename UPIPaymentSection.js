function UPIPaymentSection({ amount, billId, onPaymentComplete, loading, status }) {
  const [qrGenerated, setQrGenerated] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(600);
  const [transactionId, setTransactionId] = React.useState('');
  const [upiId, setUpiId] = React.useState('');

  React.useEffect(() => {
    if (qrGenerated && timeRemaining > 0) {
      const timer = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [qrGenerated, timeRemaining]);

  const generateQR = async () => {
    try {
      const upiString = `upi://pay?pa=Shelke0204@ybl&pn=Society&am=${amount}&cu=INR&tn=Bill-${billId.substring(0, 8)}`;
      const canvas = document.getElementById('qr-canvas');
      await QRCode.toCanvas(canvas, upiString, {
        width: 240,
        margin: 2,
        color: { dark: '#1e293b', light: '#ffffff' }
      });
      setQrGenerated(true);
    } catch (error) {
      console.error('QR generation error:', error);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">UPI Payment</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          status === 'paid' ? 'bg-green-500' : status === 'processing' ? 'bg-yellow-500 shimmer' : 'bg-gray-500'
        } text-white`}>
          {status === 'paid' ? 'Paid' : status === 'processing' ? 'Processing' : 'Pending'}
        </div>
      </div>

      {!qrGenerated ? (
        <div className="text-center py-8">
          <button onClick={generateQR} className="gold-gradient px-8 py-4 rounded-xl text-slate-900 font-bold text-lg shadow-lg hover:shadow-xl transition-all">
            <span className="icon-qr-code text-2xl mr-2"></span>
            Generate QR Code
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl mx-auto w-fit">
            <canvas id="qr-canvas"></canvas>
          </div>
          <div className="text-center text-white">
            <div className="text-sm mb-2">Scan with any UPI app</div>
            <div className="flex justify-center gap-3 mb-4">
              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                <div key={app} className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{app[0]}</span>
                </div>
              ))}
            </div>
            <div className="text-yellow-400 font-bold">
              ⏱ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="border-t border-white border-opacity-20 pt-4">
            <input
              type="text"
              placeholder="Enter UPI Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 border border-white border-opacity-20"
            />
            <button
              onClick={() => onPaymentComplete(transactionId)}
              disabled={loading || !transactionId.trim()}
              className="w-full mt-3 gold-gradient px-6 py-3 rounded-lg text-slate-900 font-bold disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Payment'}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center text-green-400 text-sm">
        <span className="icon-shield-check mr-2"></span>
        100% Secure & Encrypted Payment
      </div>
    </div>
  );
}