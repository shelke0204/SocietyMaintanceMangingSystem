function ComplaintManagement() {
  const [complaints, setComplaints] = React.useState([]);
  const [selectedComplaint, setSelectedComplaint] = React.useState(null);
  const [response, setResponse] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      if (!auth.building) {
        console.log('No admin authentication found');
        return;
      }
      
      const complaintList = await trickleListObjects('complaint', 100, true);
      if (complaintList && complaintList.items && Array.isArray(complaintList.items)) {
        const buildingComplaints = complaintList.items.filter(c => c.objectData && c.objectData.building === auth.building);
        setComplaints(buildingComplaints);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
      setComplaints([]);
    }
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    setLoading(true);
    try {
      const complaint = complaints.find(c => c.objectId === complaintId);
      await trickleUpdateObject('complaint', complaintId, {
        ...complaint.objectData,
        status: newStatus
      });
      loadComplaints();
      alert('Complaint status updated successfully!');
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert('Failed to update complaint status');
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async (complaintId) => {
    if (!response.trim()) return;
    
    setLoading(true);
    try {
      const complaint = complaints.find(c => c.objectId === complaintId);
      await trickleUpdateObject('complaint', complaintId, {
        ...complaint.objectData,
        adminResponse: response,
        status: 'in_progress'
      });
      
      setResponse('');
      setSelectedComplaint(null);
      loadComplaints();
      alert('Response submitted successfully!');
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response');
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
      <div className="space-y-6" data-name="complaint-management" data-file="components/ComplaintManagement.js">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Complaint Management</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {complaints.map((complaint) => (
            <div key={complaint.objectId} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{complaint.objectData.subject}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {complaint.objectData.residentName} - Flat {complaint.objectData.flatNumber}
                  </p>
                </div>
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

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedComplaint(complaint)}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Respond
                </button>
                <button
                  onClick={() => updateComplaintStatus(complaint.objectId, 'in_progress')}
                  disabled={loading}
                  className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateComplaintStatus(complaint.objectId, 'resolved')}
                  disabled={loading}
                  className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                >
                  Resolve
                </button>
                <button
                  onClick={() => deleteComplaint(complaint.objectId)}
                  disabled={loading}
                  className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)] mt-3">
                Filed: {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">
                Respond to: {selectedComplaint.objectData.subject}
              </h3>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="input-field"
                rows="4"
                placeholder="Type your response..."
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => submitResponse(selectedComplaint.objectId)}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Submitting...' : 'Submit Response'}
                </button>
                <button
                  onClick={() => {
                    setSelectedComplaint(null);
                    setResponse('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ComplaintManagement component error:', error);
    return null;
  }
}