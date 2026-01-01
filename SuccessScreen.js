function SuccessScreen({ billData, transactionData }) {
  const downloadReceipt = () => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Receipt', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Transaction ID: ${transactionData.transactionId}`, 20, 40);
      doc.text(`Date: ${new Date(transactionData.timestamp).toLocaleString()}`, 20, 48);
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 55, 190, 55);
      
      doc.setFontSize(12);
      doc.text('Bill Details:', 20, 65);
      doc.setFontSize(10);
      doc.text(`Society: ${billData.building}`, 20, 73);
      doc.text(`Flat: ${billData.flatNumber}`, 20, 81);
      doc.text(`Resident: ${billData.residentName}`, 20, 89);
      doc.text(`Bill Type: ${billData.objectData.billType}`, 20, 97);
      doc.text(`Period: ${billData.objectData.month}`, 20, 105);
      
      doc.line(20, 112, 190, 112);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Amount Paid: ₹${transactionData.amount}`, 20, 125);
      doc.text(`Payment Method: ${transactionData.paymentMethod.toUpperCase()}`, 20, 135);
      doc.text(`Status: PAID`, 20, 145);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('This is a computer-generated receipt and does not require a signature.', 105, 280, { align: 'center' });
      
      doc.save(`Receipt_${transactionData.transactionId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate receipt');
    }
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="glass-card rounded-3xl p-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 pulse-animation shadow-2xl">
          <span className="icon-check text-5xl text-white"></span>
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-green-300 text-lg mb-8">Your transaction has been completed successfully</p>
        
        <div className="bg-white bg-opacity-10 rounded-2xl p-6 mb-6 space-y-3 text-left">
          <div className="flex justify-between text-white">
            <span className="text-gray-300">Transaction ID</span>
            <span className="font-mono font-semibold">{transactionData.transactionId}</span>
          </div>
          <div className="flex justify-between text-white">
            <span className="text-gray-300">Amount Paid</span>
            <span className="text-2xl font-bold text-yellow-400">₹{transactionData.amount}</span>
          </div>
          <div className="flex justify-between text-white">
            <span className="text-gray-300">Payment Method</span>
            <span className="font-semibold uppercase">{transactionData.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-white">
            <span className="text-gray-300">Date & Time</span>
            <span className="font-semibold">{new Date(transactionData.timestamp).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={downloadReceipt}
            className="flex-1 gold-gradient px-6 py-4 rounded-xl text-slate-900 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <span className="icon-download mr-2"></span>
            Download Receipt
          </button>
          <button
            onClick={() => window.location.href = 'resident-dashboard.html'}
            className="flex-1 bg-white bg-opacity-20 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-opacity-30 transition-all"
          >
            <span className="icon-home mr-2"></span>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}