function ResidentBills() {
  const [bills, setBills] = React.useState([]);

  React.useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('residentAuth') || '{}');
      if (!auth.flatNumber || !auth.building) {
        console.log('No resident authentication found');
        return;
      }

      const billList = await trickleListObjects('bill', 100, true);
      if (billList && billList.items && Array.isArray(billList.items)) {
        const myBills = billList.items.filter(b => 
          b.objectData && 
          b.objectData.flatNumber === auth.flatNumber && 
          b.objectData.building === auth.building
        );
        setBills(myBills);
      } else {
        setBills([]);
      }
    } catch (error) {
      console.error('Error loading bills:', error);
      setBills([]);
    }
  };

  const handleDownloadMyBillsPDF = async () => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      const auth = JSON.parse(localStorage.getItem('residentAuth') || '{}');
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      
      doc.setFontSize(18);
      doc.text('My Bills Report', 14, 20);
      doc.setFontSize(11);
      doc.text(`Resident: ${auth.name}`, 14, 28);
      doc.text(`Flat: ${auth.flatNumber}`, 14, 34);
      doc.text(`Society: ${auth.building}`, 14, 40);
      doc.text(`Generated: ${currentDate.toLocaleDateString()}`, 14, 46);
      
      const tableData = bills.map(bill => [
        bill.objectData.billType.charAt(0).toUpperCase() + bill.objectData.billType.slice(1),
        bill.objectData.month || 'N/A',
        `₹${bill.objectData.amount}`,
        new Date(bill.objectData.dueDate).toLocaleDateString(),
        bill.objectData.status.charAt(0).toUpperCase() + bill.objectData.status.slice(1)
      ]);
      
      doc.autoTable({
        startY: 52,
        head: [['Type', 'Month', 'Amount', 'Due Date', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] }
      });
      
      const fileName = `My_Bills_${auth.name.replace(/\s+/g, '_')}_${year}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="resident-bills" data-file="components/ResidentBills.js">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">My Bills</h2>
          <button
            onClick={handleDownloadMyBillsPDF}
            disabled={bills.length === 0}
            className="btn-secondary inline-flex items-center"
          >
            <div className="icon-download text-lg mr-2"></div>
            Download My Bills PDF
          </button>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">All Bills</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Due Date</th>
                  <th className="pb-2">Month</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.objectId} className="border-b border-[var(--border-color)]">
                    <td className="py-3 font-medium capitalize">{bill.objectData.billType}</td>
                    <td className="py-3">₹{bill.objectData.amount}</td>
                    <td className="py-3">{new Date(bill.objectData.dueDate).toLocaleDateString()}</td>
                    <td className="py-3">{bill.objectData.month}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        bill.objectData.status === 'paid' ? 'bg-green-100 text-green-800' :
                        bill.objectData.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bill.objectData.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {bill.objectData.status === 'pending' && (
                        <button 
                          onClick={() => {
                            const auth = localStorage.getItem('residentAuth');
                            if (auth) {
                              window.location.href = `premium-payment.html?billId=${bill.objectId}`;
                            } else {
                              window.location.href = 'resident-login.html';
                            }
                          }}
                          className="text-sm px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {bills.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-[var(--text-secondary)]">
                      No bills found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ResidentBills component error:', error);
    return null;
  }
}
