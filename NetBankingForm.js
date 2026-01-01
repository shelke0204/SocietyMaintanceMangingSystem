function NetBankingForm({ amount, onPaymentComplete, loading }) {
  const [selectedBank, setSelectedBank] = React.useState('');
  
  const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'BOB', 'Canara'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBank) {
      alert('Please select a bank');
      return;
    }
    onPaymentComplete(`NET${Date.now()}`);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Net Banking</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 text-white"
          required
        >
          <option value="">Select Your Bank</option>
          {banks.map(bank => (
            <option key={bank} value={bank} className="text-slate-900">{bank}</option>
          ))}
        </select>
        <button type="submit" disabled={loading} className="w-full gold-gradient px-6 py-4 rounded-lg text-slate-900 font-bold text-lg disabled:opacity-50">
          {loading ? 'Processing...' : `Pay ₹${amount}`}
        </button>
      </form>
    </div>
  );
}