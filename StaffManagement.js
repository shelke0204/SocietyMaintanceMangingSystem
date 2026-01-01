function StaffManagement() {
  const [staff, setStaff] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editingStaff, setEditingStaff] = React.useState(null);
  const [formData, setFormData] = React.useState({
    fullName: '',
    role: 'Security Guard',
    mobile: '',
    salary: '',
    salaryStatus: 'unpaid',
    paymentSchedule: 'monthly',
    nextDueDate: ''
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      if (!auth.building) return;
      
      const staffList = await trickleListObjects('staff', 100, true);
      if (staffList && staffList.items && Array.isArray(staffList.items)) {
        const buildingStaff = staffList.items.filter(s => 
          s.objectData && s.objectData.building === auth.building
        );
        setStaff(buildingStaff);
      }
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      const staffData = {
        ...formData,
        building: auth.building,
        salary: parseFloat(formData.salary)
      };

      if (editingStaff) {
        await trickleUpdateObject('staff', editingStaff.objectId, staffData);
        alert('Staff updated successfully!');
      } else {
        await trickleCreateObject('staff', staffData);
        alert('Staff added successfully!');
      }
      
      resetForm();
      loadStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Failed to save staff');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData(staffMember.objectData);
    setShowForm(true);
  };

  const handleDelete = async (staffId) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    
    setLoading(true);
    try {
      await trickleDeleteObject('staff', staffId);
      loadStaff();
      alert('Staff deleted successfully!');
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Failed to delete staff');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSalaryStatus = async (staffMember, newStatus) => {
    setLoading(true);
    try {
      await trickleUpdateObject('staff', staffMember.objectId, {
        ...staffMember.objectData,
        salaryStatus: newStatus
      });
      loadStaff();
      alert('Salary status updated successfully!');
    } catch (error) {
      console.error('Error updating salary status:', error);
      alert('Failed to update salary status');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '', role: 'Security Guard', mobile: '',
      salary: '', salaryStatus: 'unpaid', paymentSchedule: 'monthly',
      nextDueDate: ''
    });
    setEditingStaff(null);
    setShowForm(false);
  };

  try {
    return (
      <div className="space-y-6" data-name="staff-management" data-file="components/StaffManagement.js">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Staff Management</h2>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center">
            <div className="icon-user-plus text-lg mr-2"></div>
            Add Staff Member
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">
              {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role/Designation</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="input-field">
                  <option value="Security Guard">Security Guard</option>
                  <option value="Water Supply Staff">Water Supply Staff</option>
                  <option value="Waste Management Staff">Waste Management Staff</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="Gardener">Gardener</option>
                  <option value="Maintenance Staff">Maintenance Staff</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mobile Number</label>
                <input type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="input-field" maxLength="10" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Salary Amount</label>
                <input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} className="input-field" step="0.01" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Schedule</label>
                <select value={formData.paymentSchedule} onChange={(e) => setFormData({...formData, paymentSchedule: e.target.value})} className="input-field">
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Next Due Date</label>
                <input type="date" value={formData.nextDueDate} onChange={(e) => setFormData({...formData, nextDueDate: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Salary Status</label>
                <select value={formData.salaryStatus} onChange={(e) => setFormData({...formData, salaryStatus: e.target.value})} className="input-field">
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Staff Members</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Mobile</th>
                  <th className="pb-2">Salary</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Schedule</th>
                  <th className="pb-2">Next Due</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.objectId} className="border-b border-[var(--border-color)]">
                    <td className="py-3 font-medium">{member.objectData.fullName}</td>
                    <td className="py-3">{member.objectData.role}</td>
                    <td className="py-3">{member.objectData.mobile}</td>
                    <td className="py-3">₹{member.objectData.salary}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        member.objectData.salaryStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {member.objectData.salaryStatus}
                      </span>
                    </td>
                    <td className="py-3 capitalize">{member.objectData.paymentSchedule}</td>
                    <td className="py-3">{new Date(member.objectData.nextDueDate).toLocaleDateString()}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        <button onClick={() => handleEdit(member)} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
                          Edit
                        </button>
                        {member.objectData.salaryStatus === 'unpaid' && (
                          <button onClick={() => handleUpdateSalaryStatus(member, 'paid')} disabled={loading} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200">
                            Mark Paid
                          </button>
                        )}
                        {member.objectData.salaryStatus === 'paid' && (
                          <button onClick={() => handleUpdateSalaryStatus(member, 'unpaid')} disabled={loading} className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200">
                            Mark Unpaid
                          </button>
                        )}
                        <button onClick={() => handleDelete(member.objectId)} disabled={loading} className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {staff.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-[var(--text-secondary)]">
                      No staff members found. Click "Add Staff Member" to get started.
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
    console.error('StaffManagement component error:', error);
    return null;
  }
}