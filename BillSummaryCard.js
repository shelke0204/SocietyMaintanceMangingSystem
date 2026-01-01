function BillSummaryCard({ billData, status }) {
  return (
    <div className="glass-card rounded-2xl p-6 sticky top-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="icon-file-text text-yellow-400 mr-2"></span>
        Bill Summary
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between text-white">
          <span className="text-gray-300">Society</span>
          <span className="font-semibold">{billData.building}</span>
        </div>
        <div className="flex justify-between text-white">
          <span className="text-gray-300">Flat Number</span>
          <span className="font-semibold">{billData.flatNumber}</span>
        </div>
        <div className="flex justify-between text-white">
          <span className="text-gray-300">Resident</span>
          <span className="font-semibold">{billData.residentName}</span>
        </div>
        <div className="flex justify-between text-white">
          <span className="text-gray-300">Bill Type</span>
          <span className="font-semibold capitalize">{billData.objectData.billType}</span>
        </div>
        <div className="flex justify-between text-white">
          <span className="text-gray-300">Period</span>
          <span className="font-semibold">{billData.objectData.month}</span>
        </div>
        <div className="border-t border-white border-opacity-20 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-white">Total Amount</span>
            <span className="text-3xl font-bold text-yellow-400">₹{billData.objectData.amount}</span>
          </div>
        </div>
        <div className={`px-4 py-3 rounded-lg text-center font-semibold ${
          status === 'paid' ? 'bg-green-500' : status === 'processing' ? 'bg-yellow-500 shimmer' : 'bg-gray-600'
        }`}>
          {status === 'paid' ? '✓ Payment Complete' : status === 'processing' ? '⏳ Processing...' : '● Pending Payment'}
        </div>
      </div>
      <div className="mt-6 p-4 bg-green-500 bg-opacity-20 rounded-lg border border-green-500">
        <div className="flex items-start text-green-300 text-sm">
          <span className="icon-shield-check text-lg mr-2 mt-0.5"></span>
          <p>Your transaction is protected by bank-grade encryption and PCI-DSS compliance</p>
        </div>
      </div>
    </div>
  );
}
