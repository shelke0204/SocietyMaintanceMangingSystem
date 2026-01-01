function AdminHeader() {
  try {
    const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
    
    return (
      <header className="bg-white border-b border-[var(--border-color)] px-3 sm:px-4 md:px-6 py-4 shadow-sm" data-name="admin-header" data-file="components/AdminHeader.js">
        <div className="flex justify-between items-center">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-primary)] truncate">Society Management Dashboard</h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] truncate mt-1">
              <span className="icon-building text-sm mr-1"></span>
              {auth.building}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 ml-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">{auth.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">ID: {auth.registrationNo}</p>
            </div>
            
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <div className="icon-user text-base sm:text-lg text-white"></div>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('AdminHeader component error:', error);
    return null;
  }
}