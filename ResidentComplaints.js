function ResidentComplaints() {
  const [complaints, setComplaints] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    subject: '',
    description: '',
    category: 'maintenance',
    priority: 'medium'
  });
  const [loading, setLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');

  React.useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('residentAuth') || '{}');
      if (!auth.flatNumber || !auth.building) {
        console.log('No resident authentication found');
        return;
      }

      const complaintList = await trickleListObjects('complaint', 100, true);
      if (complaintList && complaintList.items && Array.isArray(complaintList.items)) {
        const myComplaints = complaintList.items.filter(c => 
          c.objectData && 
          c.objectData.flatNumber === auth.flatNumber && 
          c.objectData.building === auth.building
        );
        setComplaints(myComplaints);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
      setComplaints([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const auth = JSON.parse(localStorage.getItem('residentAuth') || '{}');
      await trickleCreateObject('complaint', {
        ...formData,
        residentName: auth.name,
        flatNumber: auth.flatNumber,
        building: auth.building,
        status: 'open'
      });
      
      setFormData({
        subject: '', description: '', category: 'maintenance', priority: 'medium'
      });
      setSuccessMessage('Successfully Submitted');
      setTimeout(() => {
        setShowForm(false);
        setSuccessMessage('');
      }, 3000);
      loadComplaints();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const deleteComplaint = async (complaintId) => {
    if (!confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      await trickleDeleteObject('complaint', complaintId);
      loadComplaints();
      alert('Complaint deleted successfully!');
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('Failed to delete complaint');
    } finally {
      setLoading(false);
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="resident-complaints" data-file="components/ResidentComplaints.js">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">My Complaints</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <div className="icon-plus text-lg mr-2"></div>
            Submit Complaint
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Submit New Complaint</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field"
                  rows="4"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input-field"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="security">Security</option>
                    <option value="noise">Noise</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              {successMessage && (
                <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center">
                  {successMessage}
                </div>
              )}
              
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Submitting...' : 'Submit Complaint'}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {complaints.map((complaint) => (
            <div key={complaint.objectId} className="card">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{complaint.objectData.subject}</h3>
                <div className="flex flex-col gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    complaint.objectData.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    complaint.objectData.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    complaint.objectData.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {complaint.objectData.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    complaint.objectData.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    complaint.objectData.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {complaint.objectData.priority}
                  </span>
                </div>
              </div>
              
              <p className="text-[var(--text-secondary)] mb-3">{complaint.objectData.description}</p>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                Category: <span className="capitalize">{complaint.objectData.category}</span>
              </p>

              {complaint.objectData.adminResponse && (
                <div className="bg-[var(--secondary-color)] p-3 rounded-lg mb-3">
                  <p className="text-sm font-medium mb-1">Admin Response:</p>
                  <p className="text-sm">{complaint.objectData.adminResponse}</p>
                </div>
              )}

              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-[var(--text-secondary)]">
                  Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => deleteComplaint(complaint.objectId)}
                  disabled={loading}
                  className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {complaints.length === 0 && (
            <div className="col-span-2 text-center py-8">
              <p className="text-[var(--text-secondary)]">No complaints submitted yet</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ResidentComplaints component error:', error);
    return null;
  }
}