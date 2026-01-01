function AdminSidebar({ activeSection, setActiveSection }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  try {
    const menuItems = [
      { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
      { id: 'manage-admins', icon: 'shield-check', label: 'Manage Admins' },
      { id: 'flats', icon: 'home', label: 'Register Flat' },
      { id: 'residents', icon: 'users', label: 'Manage Residents' },
      { id: 'bills', icon: 'file-text', label: 'Generate Bills' },
      { id: 'notices', icon: 'megaphone', label: 'Upload Notices' },
      { id: 'complaints', icon: 'message-circle', label: 'View Complaints' },
      { id: 'water-schedule', icon: 'droplets', label: 'Water Schedule' },
      { id: 'staff', icon: 'users-2', label: 'Staff Management' },
      { id: 'feedback', icon: 'message-square', label: 'Feedback' }
    ];

    const handleLogout = () => {
      SessionManager.logout('admin');
    };

    return (
      <>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-[var(--border-color)]"
        >
          <div className={`icon-${isMobileMenuOpen ? 'x' : 'menu'} text-xl text-[var(--text-primary)]`}></div>
        </button>
        
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
        
      <div className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 z-30 transition-transform duration-300 flex flex-col ${!isMobileMenuOpen && 'md:translate-x-0 -translate-x-full'} ${isMobileMenuOpen && 'translate-x-0'}`} data-name="admin-sidebar" data-file="components/AdminSidebar.js">
        <div className="p-6 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="icon-building text-xl text-white"></div>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-400">Management Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-item ${activeSection === item.id ? 'active' : ''} mb-2`}
              onClick={() => {
                setActiveSection(item.id);
                setIsMobileMenuOpen(false);
              }}
            >
              <div className={`icon-${item.icon} text-base sm:text-lg mr-2 sm:mr-3`}></div>
              <span className="text-sm sm:text-base">{item.label}</span>
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-950 rounded-xl transition-all"
          >
            <div className="icon-log-out text-lg mr-3"></div>
            Logout
          </button>
        </div>
      </div>
      </>
    );
  } catch (error) {
    console.error('AdminSidebar component error:', error);
    return null;
  }
}