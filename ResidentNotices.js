function ResidentNotices() {
  const [notices, setNotices] = React.useState([]);

  React.useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('residentAuth') || '{}');
      if (!auth.building) {
        console.log('No resident authentication found');
        return;
      }

      const noticeList = await trickleListObjects('notice', 100, true);
      if (noticeList && noticeList.items && Array.isArray(noticeList.items)) {
        const buildingNotices = noticeList.items.filter(n => 
          n.objectData && n.objectData.building === auth.building
        );
        setNotices(buildingNotices);
      } else {
        setNotices([]);
      }
    } catch (error) {
      console.error('Error loading notices:', error);
      setNotices([]);
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="resident-notices" data-file="components/ResidentNotices.js">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Society Notices</h2>
        </div>

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
              <p className="text-[var(--text-secondary)] mb-4">{notice.objectData.content}</p>
              <div className="text-xs text-[var(--text-secondary)]">
                <p>Posted: {new Date(notice.createdAt).toLocaleDateString()}</p>
                {notice.objectData.expiryDate && (
                  <p>Expires: {new Date(notice.objectData.expiryDate).toLocaleDateString()}</p>
                )}
                <p>By: Admin {notice.objectData.adminId}</p>
              </div>
            </div>
          ))}
          {notices.length === 0 && (
            <div className="col-span-2 text-center py-8">
              <p className="text-[var(--text-secondary)]">No notices available</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ResidentNotices component error:', error);
    return null;
  }
}