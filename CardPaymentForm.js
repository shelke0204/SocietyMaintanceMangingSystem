function CardPaymentForm({ amount, onPaymentComplete, loading }) {
  const [formData, setFormData] = React.useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.cardNumber.length < 16) {
      alert('Invalid card number');
      return;
    }
    onPaymentComplete(`CARD${Date.now()}`);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Card Payment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={(e) => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})}
            maxLength="16"
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400"
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Cardholder Name"
            value={formData.cardName}
            onChange={(e) => setFormData({...formData, cardName: e.target.value})}
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="MM/YY"
            value={formData.expiry}
            onChange={(e) => setFormData({...formData, expiry: e.target.value})}
            maxLength="5"
            className="px-4 py-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400"
            required
          />
          <input
            type="password"
            placeholder="CVV"
            value={formData.cvv}
            onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
            maxLength="3"
            className="px-4 py-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="w-full gold-gradient px-6 py-4 rounded-lg text-slate-900 font-bold text-lg disabled:opacity-50">
          {loading ? 'Processing...' : `Pay ₹${amount}`}
        </button>
      </form>
    </div>
  );
}