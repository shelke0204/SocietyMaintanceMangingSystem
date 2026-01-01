function NoticeManagement() {
  const [notices, setNotices] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    content: '',
    priority: 'medium',
    expiryDate: ''
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      if (!auth.building) {
        console.log('No admin authentication found');
        return;
      }
      
      const noticeList = await trickleListObjects('notice', 100, true);
      if (noticeList && noticeList.items && Array.isArray(noticeList.items)) {
        const buildingNotices = noticeList.items.filter(n => n.objectData && n.objectData.building === auth.building);
        setNotices(buildingNotices);
      } else {
        setNotices([]);
      }
    } catch (error) {
      console.error('Error loading notices:', error);
      setNotices([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      await trickleCreateObject('notice', {
        ...formData,
        building: auth.building,
        adminId: auth.registrationNo
      });
      
      setFormData({
        title: '', content: '', priority: 'medium', expiryDate: ''
      });
      setShowForm(false);
      loadNotices();
      alert('Notice posted successfully!');
    } catch (error) {
      console.error('Error creating notice:', error);
      alert('Failed to post notice');
    } finally {
      setLoading(false);
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="notice-management" data-file="components/NoticeManagement.js">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Notice Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <div className="icon-plus text-lg mr-2"></div>
            Post New Notice
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Post New Notice</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Notice Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="input-field"
                  rows="4"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Posting...' : 'Post Notice'}
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
          {notices.map((notice) => (
            <div key={notice.objectId} className="card">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{notice.objectData.title}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  notice.objectData.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  notice.objectData.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  notice.objectData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {notice.objectData.priority}
                </span>
              </div>
              <p className="text-[var(--text-secondary)] mb-3">{notice.objectData.content}</p>
              <div className="text-xs text-[var(--text-secondary)]">
                <p>Posted: {new Date(notice.createdAt).toLocaleDateString()}</p>
                {notice.objectData.expiryDate && (
                  <p>Expires: {new Date(notice.objectData.expiryDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('NoticeManagement component error:', error);
    return null;
  }
}