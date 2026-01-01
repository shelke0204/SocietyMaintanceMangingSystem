function BillManagement() {
  const [bills, setBills] = React.useState([]);
  const [flats, setFlats] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    flatNumber: '',
    billType: 'maintenance',
    amount: '',
    dueDate: '',
    month: '',
    description: ''
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadBills();
    loadFlats();
  }, []);

  const loadFlats = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      if (!auth.building) {
        console.log('No admin authentication found');
        return;
      }
      
      const flatList = await trickleListObjects('flat', 100, true);
      if (flatList && flatList.items && Array.isArray(flatList.items)) {
        const buildingFlats = flatList.items.filter(f => 
          f.objectData && f.objectData.building === auth.building
        );
        setFlats(buildingFlats);
      } else {
        setFlats([]);
      }
    } catch (error) {
      console.error('Error loading flats:', error);
      setFlats([]);
    }
  };

  const loadBills = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      if (!auth.building) {
        console.log('No admin authentication found');
        return;
      }
      
      const billList = await trickleListObjects('bill', 100, true);
      if (billList && billList.items && Array.isArray(billList.items)) {
        const buildingBills = billList.items.filter(b => b.objectData && b.objectData.building === auth.building);
        setBills(buildingBills);
      } else {
        setBills([]);
      }
    } catch (error) {
      console.error('Error loading bills:', error);
      setBills([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      await trickleCreateObject('bill', {
        ...formData,
        building: auth.building,
        amount: parseFloat(formData.amount),
        status: 'pending'
      });
      
      setFormData({
        flatNumber: '', billType: 'maintenance', amount: '',
        dueDate: '', month: '', description: ''
      });
      setShowForm(false);
      loadBills();
      alert(`Bill generated successfully for Flat ${formData.flatNumber}! The resident will be notified.`);
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Failed to generate bill');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async (billId) => {
    if (!confirm('Are you sure you want to delete this bill? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      await trickleDeleteObject('bill', billId);
      loadBills();
      alert('Bill deleted successfully!');
    } catch (error) {
      console.error('Error deleting bill:', error);
      alert('Failed to delete bill');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAllBillsPDF = async () => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      const currentDate = new Date();
      
      // Calculate date range (current month)
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const dateRange = `${startDate.getDate()} ${startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} to ${endDate.getDate()} ${endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
      
      let yPosition = 20;
      
      // Header - Bill Statement
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Bill Statement', 105, yPosition, { align: 'center' });
      yPosition += 8;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`(${dateRange})`, 105, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Society Information
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Society Details:', 14, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Society Name: ${auth.building}`, 14, yPosition);
      yPosition += 5;
      doc.text(`Registration Number: ${auth.registrationNo}`, 14, yPosition);
      yPosition += 5;
      doc.text(`Admin Name: ${auth.name}`, 14, yPosition);
      yPosition += 5;
      doc.text(`Generated Date: ${currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`, 14, yPosition);
      yPosition += 10;
      
      // Add separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPosition, 196, yPosition);
      yPosition += 8;
      
      // Bills Table
      const tableData = bills.map(bill => {
        // Find resident name for this flat
        const residentList = [];
        return [
          bill.objectData.flatNumber,
          '-', // Resident name placeholder
          bill.objectData.billType.charAt(0).toUpperCase() + bill.objectData.billType.slice(1),
          bill.objectData.month || 'N/A',
          `₹${bill.objectData.amount}`,
          new Date(bill.objectData.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          bill.objectData.status.charAt(0).toUpperCase() + bill.objectData.status.slice(1)
        ];
      });
      
      doc.autoTable({
        startY: yPosition,
        head: [['Flat No.', 'Resident', 'Bill Type', 'Period', 'Amount', 'Due Date', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 9
        },
        columnStyles: {
          6: { 
            cellWidth: 20,
            halign: 'center',
            fontStyle: 'bold'
          }
        },
        didParseCell: function(data) {
          if (data.column.index === 6 && data.section === 'body') {
            if (data.cell.text[0] === 'Paid') {
              data.cell.styles.textColor = [16, 185, 129];
            } else if (data.cell.text[0] === 'Unpaid' || data.cell.text[0] === 'Pending') {
              data.cell.styles.textColor = [239, 68, 68];
            }
          }
        }
      });
      
      // Get final Y position after table
      const finalY = doc.lastAutoTable.finalY + 15;
      
      // Digital Authorization Section
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Digital Authorization:', 14, finalY);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`This is a system-generated electronic bill statement.`, 14, finalY + 6);
      doc.text(`No physical signature is required.`, 14, finalY + 11);
      
      doc.setFont('helvetica', 'bold');
      doc.text(`Authorized by: ${auth.name}`, 14, finalY + 18);
      doc.setFont('helvetica', 'normal');
      doc.text(`Registration No: ${auth.registrationNo}`, 14, finalY + 23);
      doc.text(`Society: ${auth.building}`, 14, finalY + 28);
      
      // Footer - Copyright
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('© 2025 Society Maintenance Managing System. All rights reserved.', 105, pageHeight - 10, { align: 'center' });
      
      // Save PDF
      const fileName = `Bill_Statement_${startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).replace(' ', '_')}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="bill-management" data-file="components/BillManagement.js">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Bill Management</h2>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadAllBillsPDF}
              disabled={loading || bills.length === 0}
              className="btn-secondary inline-flex items-center"
            >
              <div className="icon-download text-lg mr-2"></div>
              Download All Bills PDF
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center"
            >
              <div className="icon-plus text-lg mr-2"></div>
              Generate New Bill
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Generate New Bill</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Flat</label>
                <select
                  value={formData.flatNumber}
                  onChange={(e) => setFormData({...formData, flatNumber: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="">Choose a flat</option>
                  {flats.map((flat) => (
                    <option key={flat.objectId} value={flat.objectData.flatNumber}>
                      Flat {flat.objectData.flatNumber} - {flat.objectData.flatType} ({flat.objectData.status})
                    </option>
                  ))}
                </select>
                {flats.length === 0 && (
                  <p className="text-xs text-red-600 mt-1">No flats registered. Please register flats first.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bill Type</label>
                <select
                  value={formData.billType}
                  onChange={(e) => setFormData({...formData, billType: e.target.value})}
                  className="input-field"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="water">Water</option>
                  <option value="electricity">Electricity</option>
                  <option value="parking">Parking</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Month/Period</label>
                <input
                  type="text"
                  value={formData.month}
                  onChange={(e) => setFormData({...formData, month: e.target.value})}
                  className="input-field"
                  placeholder="e.g., September 2025"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field"
                  placeholder="Bill description"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading || flats.length === 0} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Generating...' : 'Generate Bill'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Generated Bills</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="pb-2">Flat</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Due Date</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.objectId} className="border-b border-[var(--border-color)]">
                    <td className="py-3 font-medium">{bill.objectData.flatNumber}</td>
                    <td className="py-3 capitalize">{bill.objectData.billType}</td>
                    <td className="py-3">₹{bill.objectData.amount}</td>
                    <td className="py-3">{new Date(bill.objectData.dueDate).toLocaleDateString()}</td>
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
                      <button
                        onClick={() => handleDeleteBill(bill.objectId)}
                        disabled={loading}
                        className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('BillManagement component error:', error);
    return null;
  }
}