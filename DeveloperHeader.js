function DeveloperHeader() {
  try {
    const auth = JSON.parse(localStorage.getItem('developerAuth') || '{}');

    const handleLogout = () => {
      localStorage.removeItem('developerAuth');
      window.location.href = 'developer-login.html';
    };
    
    return (
      <header className="bg-[var(--primary-color)] text-white shadow-lg" data-name="developer-header" data-file="components/DeveloperHeader.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center">
                <div className="icon-shield text-xl text-white"></div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold">Developer Dashboard</h1>
                <p className="text-red-100 text-sm">System Administration Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">Developer: {auth.username}</p>
                <p className="text-xs text-red-100">Role: {auth.role}</p>
                <p className="text-xs text-red-100">Login: {new Date(auth.loginTime).toLocaleTimeString()}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-red-100 hover:text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                <div className="icon-log-out text-lg mr-2"></div>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('DeveloperHeader component error:', error);
    return null;
  }
}