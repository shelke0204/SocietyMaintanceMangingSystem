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

function AdminDashboardApp() {
  const [activeSection, setActiveSection] = React.useState('dashboard');
  
  // Check authentication and start session management
  React.useEffect(() => {
    // Check if user is authenticated
    if (!SessionManager.checkSession('admin')) {
      return;
    }

    // Start inactivity timer
    const cleanup = SessionManager.startInactivityTimer('admin');

    // Listen for quick action events
    const handleSectionChange = (event) => {
      setActiveSection(event.detail);
    };

    window.addEventListener('changeSection', handleSectionChange);
    
    return () => {
      cleanup();
      window.removeEventListener('changeSection', handleSectionChange);
    };
  }, []);

  try {
    return (
      <div className="min-h-screen bg-gray-50 flex" data-name="admin-dashboard-app" data-file="admin-dashboard-app.js">
        <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div className="flex-1 md:ml-64 w-full">
          <AdminHeader />
          
          <main className="p-3 sm:p-4 md:p-6">
            {activeSection === 'dashboard' && <DashboardStats />}
            {activeSection === 'manage-admins' && <SecureAdminManagement />}
            {activeSection === 'residents' && <ResidentManagement />}
            {activeSection === 'flats' && <FlatManagement />}
            {activeSection === 'bills' && <BillManagement />}
            {activeSection === 'notices' && <NoticeManagement />}
            {activeSection === 'complaints' && <ComplaintManagement />}
            {activeSection === 'water-schedule' && <WaterScheduleManagement />}
            {activeSection === 'staff' && <StaffManagement />}
            {activeSection === 'feedback' && <FeedbackManagement />}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AdminDashboardApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <AdminDashboardApp />
  </ErrorBoundary>
);