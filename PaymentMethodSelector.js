function PaymentMethodSelector({ method, setMethod }) {
  const methods = [
    { id: 'upi', icon: 'smartphone', name: 'UPI', desc: 'GPay, PhonePe, Paytm' },
    { id: 'card', icon: 'credit-card', name: 'Card', desc: 'Debit/Credit Card' },
    { id: 'netbanking', icon: 'building-2', name: 'Net Banking', desc: 'All Banks' },
    { id: 'wallet', icon: 'wallet', name: 'Wallets', desc: 'Coming Soon' },
    { id: 'emi', icon: 'repeat', name: 'EMI', desc: 'Coming Soon' }
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="icon-credit-card text-yellow-400 mr-3 text-3xl"></span>
        Select Payment Method
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => m.id !== 'wallet' && m.id !== 'emi' && setMethod(m.id)}
            disabled={m.id === 'wallet' || m.id === 'emi'}
            className={`p-4 rounded-xl transition-all ${
              method === m.id 
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-slate-900 shadow-lg scale-105' 
                : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
            } ${(m.id === 'wallet' || m.id === 'emi') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`icon-${m.icon} text-3xl mb-2 mx-auto w-12 h-12 flex items-center justify-center`}></div>
            <div className="text-sm font-semibold">{m.name}</div>
            <div className="text-xs opacity-80">{m.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}