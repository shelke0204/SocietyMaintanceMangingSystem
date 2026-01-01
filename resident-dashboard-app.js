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

function ResidentDashboardApp() {
  const [activeSection, setActiveSection] = React.useState('dashboard');
  
  // Check authentication and start session management
  React.useEffect(() => {
    // Check if user is authenticated
    if (!SessionManager.checkSession('resident')) {
      return;
    }

    // Start inactivity timer
    const cleanup = SessionManager.startInactivityTimer('resident');
    
    return () => {
      cleanup();
    };
  }, []);

  try {
    return (
      <div className="min-h-screen bg-gray-50 flex" data-name="resident-dashboard-app" data-file="resident-dashboard-app.js">
        <ResidentSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div className="flex-1 md:ml-64 w-full">
          <ResidentHeader />
          
          <main className="p-3 sm:p-4 md:p-6">
            {activeSection === 'dashboard' && <ResidentDashboard />}
            {activeSection === 'bills' && <ResidentBills />}
            {activeSection === 'notices' && <ResidentNotices />}
            {activeSection === 'complaints' && <ResidentComplaints />}
            {activeSection === 'water-schedule' && <ResidentWaterSchedule />}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ResidentDashboardApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <ResidentDashboardApp />
  </ErrorBoundary>
);