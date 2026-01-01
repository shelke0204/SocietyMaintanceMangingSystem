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

function ContactApp() {
  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" data-name="contact-app" data-file="contact-app.js">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <a href="index.html" className="inline-flex items-center text-[var(--primary-color)] hover:text-blue-700 mb-4">
              <div className="icon-arrow-left text-lg mr-2"></div>
              Back to Home
            </a>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Contact & Feedback</h1>
            <p className="text-[var(--text-secondary)] mt-2">Send feedback to your society administration</p>
          </div>
          
          <ContactForm />
        </div>
      </div>
    );
  } catch (error) {
    console.error('ContactApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <ContactApp />
  </ErrorBoundary>
);