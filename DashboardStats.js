function DashboardStats() {
  const [stats, setStats] = React.useState([
    { title: 'Total Residents', value: '0', icon: 'users', color: 'from-blue-500 to-cyan-500' },
    { title: 'Active Flats', value: '0', icon: 'home', color: 'from-green-500 to-emerald-500' },
    { title: 'Pending Bills', value: '0', icon: 'file-text', color: 'from-yellow-500 to-orange-500' },
    { title: 'Open Complaints', value: '0', icon: 'message-circle', color: 'from-red-500 to-pink-500' }
  ]);
  const [activities, setActivities] = React.useState([]);
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      
      if (!auth.building) {
        console.log('No admin authentication found');
        return;
      }
      
      let residents = { items: [] };
      let flats = { items: [] };
      let bills = { items: [] };
      let complaints = { items: [] };
      
      try {
        residents = await trickleListObjects('resident', 100, true) || { items: [] };
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
      
      try {
        flats = await trickleListObjects('flat', 100, true) || { items: [] };
      } catch (error) {
        console.error('Error fetching flats:', error);
      }
      
      try {
        bills = await trickleListObjects('bill', 100, true) || { items: [] };
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
      
      try {
        complaints = await trickleListObjects('complaint', 100, true) || { items: [] };
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }

      const myResidents = residents.items.filter(r => r.objectData && r.objectData.building === auth.building);
      const myFlats = flats.items.filter(f => f.objectData && f.objectData.building === auth.building);
      const myBills = bills.items.filter(b => b.objectData && b.objectData.building === auth.building);
      const myComplaints = complaints.items.filter(c => c.objectData && c.objectData.building === auth.building);

      const pendingBills = myBills.filter(b => b.objectData.status === 'pending').length;
      const openComplaints = myComplaints.filter(c => c.objectData.status === 'open').length;
      
      setStats([
        { title: 'Total Residents', value: myResidents.length.toString(), icon: 'users', color: 'from-blue-500 to-cyan-500' },
        { title: 'Active Flats', value: myFlats.filter(f => f.objectData.status === 'occupied').length.toString(), icon: 'home', color: 'from-green-500 to-emerald-500' },
        { title: 'Pending Bills', value: pendingBills.toString(), icon: 'file-text', color: 'from-yellow-500 to-orange-500' },
        { title: 'Open Complaints', value: openComplaints.toString(), icon: 'message-circle', color: 'from-red-500 to-pink-500' }
      ]);

      const recentResidents = myResidents.slice(0, 3);
      setActivities(recentResidents.map(r => ({
        text: `New resident ${r.objectData.name} registered - Flat ${r.objectData.flatNumber}`,
        time: new Date(r.createdAt).toLocaleDateString()
      })));

      const urgentComplaints = myComplaints.filter(c => c.objectData.priority === 'high' && c.objectData.status === 'open').slice(0, 3);
      setTasks(urgentComplaints.map(c => ({
        text: `Review complaint: ${c.objectData.subject} - Flat ${c.objectData.flatNumber}`,
        priority: c.objectData.priority
      })));

    } catch (error) {
      console.error('Dashboard data loading error:', error);
    }
  };

  try {

    const quickActions = [
      { title: 'Register New Flat', icon: 'home-plus', action: 'flats', color: 'from-blue-500 to-cyan-500' },
      { title: 'Add Resident', icon: 'user-plus', action: 'residents', color: 'from-green-500 to-emerald-500' },
      { title: 'Generate Bill', icon: 'receipt', action: 'bills', color: 'from-orange-500 to-red-500' },
      { title: 'Post Notice', icon: 'bell', action: 'notices', color: 'from-purple-500 to-pink-500' },
      { title: 'Staff Management', icon: 'users-round', action: 'staff', color: 'from-indigo-500 to-purple-500' },
      { title: 'Manage Admins', icon: 'shield-check', action: 'manage-admins', color: 'from-red-500 to-orange-500' }
    ];

    const handleQuickAction = (actionId) => {
      window.dispatchEvent(new CustomEvent('changeSection', { detail: actionId }));
    };

    return (
      <div className="space-y-6" data-name="dashboard-stats" data-file="components/DashboardStats.js">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <div className={`icon-${stat.icon} text-2xl text-white`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <div className="icon-zap text-xl text-blue-600 mr-2"></div>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="flex items-center p-4 bg-gradient-to-br from-white to-gray-50 border border-[var(--border-color)] rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mr-3 shadow-md`}>
                  <div className={`icon-${action.icon} text-xl text-white`}></div>
                </div>
                <span className="font-semibold text-sm">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <div className="icon-activity text-xl text-green-600 mr-2"></div>
              Recent Activities
            </h3>
            <div className="space-y-3">
              {activities.length > 0 ? activities.map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <div className="icon-check text-sm text-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.text}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-[var(--text-secondary)] text-center py-4">No recent activities</p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <div className="icon-alert-circle text-xl text-orange-600 mr-2"></div>
              Pending Tasks
            </h3>
            <div className="space-y-3">
              {tasks.length > 0 ? tasks.map((task, index) => (
                <div key={index} className="flex items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <div className="icon-clock text-sm text-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.text}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Priority: {task.priority}</p>
                  </div>
                </div>
              )) : (
                <p className="text-[var(--text-secondary)] text-center py-4">No pending tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DashboardStats component error:', error);
    return null;
  }
}