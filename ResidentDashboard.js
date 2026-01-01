function ResidentDashboard() {
  const [stats, setStats] = React.useState({
    pendingBills: 0,
    totalNotices: 0,
    myComplaints: 0
  });
  const [recentBills, setRecentBills] = React.useState([]);
  const [recentNotices, setRecentNotices] = React.useState([]);

  React.useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('residentAuth') || '{}');
      if (!auth.flatNumber) return;

      const billList = await trickleListObjects('bill', 100, true);
      if (billList && billList.items) {
        const myBills = billList.items.filter(b => 
          b.objectData && 
          b.objectData.flatNumber === auth.flatNumber && 
          b.objectData.building === auth.building
        );
        const pendingBills = myBills.filter(b => b.objectData.status === 'pending');
        setStats(prev => ({ ...prev, pendingBills: pendingBills.length }));
        setRecentBills(myBills.slice(0, 3));
      }

      const noticeList = await trickleListObjects('notice', 100, true);
      if (noticeList && noticeList.items) {
        const buildingNotices = noticeList.items.filter(n => 
          n.objectData && n.objectData.building === auth.building
        );
        setStats(prev => ({ ...prev, totalNotices: buildingNotices.length }));
        setRecentNotices(buildingNotices.slice(0, 3));
      }

      const complaintList = await trickleListObjects('complaint', 100, true);
      if (complaintList && complaintList.items) {
        const myComplaints = complaintList.items.filter(c => 
          c.objectData && 
          c.objectData.flatNumber === auth.flatNumber && 
          c.objectData.building === auth.building
        );
        setStats(prev => ({ ...prev, myComplaints: myComplaints.length }));
      }
    } catch (error) {
      console.error('Dashboard data loading error:', error);
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="resident-dashboard" data-file="components/ResidentDashboard.js">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">Pending Bills</p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">{stats.pendingBills}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <div className="icon-file-text text-2xl text-white"></div>
              </div>
            </div>
          </div>

          <div className="card group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">Society Notices</p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">{stats.totalNotices}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <div className="icon-megaphone text-2xl text-white"></div>
              </div>
            </div>
          </div>

          <div className="card group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">My Complaints</p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">{stats.myComplaints}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <div className="icon-message-circle text-2xl text-white"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <div className="icon-receipt text-xl text-yellow-600 mr-2"></div>
              Recent Bills
            </h3>
            <div className="space-y-3">
              {recentBills.length > 0 ? recentBills.map((bill, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-medium capitalize">{bill.objectData.billType}</p>
                    <p className="text-sm text-[var(--text-secondary)]">Due: {new Date(bill.objectData.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{bill.objectData.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      bill.objectData.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bill.objectData.status}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-[var(--text-secondary)] text-center py-8">No bills available</p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <div className="icon-bell text-xl text-blue-600 mr-2"></div>
              Latest Notices
            </h3>
            <div className="space-y-3">
              {recentNotices.length > 0 ? recentNotices.map((notice, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-[var(--text-primary)]">{notice.objectData.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      notice.objectData.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      notice.objectData.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {notice.objectData.priority}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{notice.objectData.content}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )) : (
                <p className="text-[var(--text-secondary)] text-center py-8">No notices available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ResidentDashboard component error:', error);
    return null;
  }
}