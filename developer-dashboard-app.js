class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--secondary-color)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Something went wrong</h1>
            <p className="text-[var(--text-secondary)] mb-4">We're sorry, but something unexpected happened.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function DeveloperDashboardApp() {
  const [activeSection, setActiveSection] = React.useState('admins');
  
  // Check authentication
  React.useEffect(() => {
    const auth = localStorage.getItem('developerAuth');
    if (!auth) {
      window.location.href = 'developer-login.html';
    }
  }, []);

  try {
    return (
      <div className="min-h-screen bg-gray-50" data-name="developer-dashboard-app" data-file="developer-dashboard-app.js">
        <DeveloperHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection('admins')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeSection === 'admins' 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'bg-white text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                Admin Management
              </button>
              <button
                onClick={() => setActiveSection('password')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeSection === 'password' 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'bg-white text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                Change Password
              </button>
            </div>
          </div>
          
          <main>
            {activeSection === 'admins' && <DeveloperAdminList />}
            {activeSection === 'password' && <DeveloperPasswordChange />}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DeveloperDashboardApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <DeveloperDashboardApp />
  </ErrorBoundary>
);