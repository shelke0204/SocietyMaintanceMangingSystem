function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  try {
    return (
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-effect shadow-lg py-3' : 'bg-transparent py-4'
        }`}
        data-name="header" 
        data-file="components/Header.js"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="icon-building text-xl text-white"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-[var(--text-primary)]">Society Manager</h1>
                <p className="text-xs text-[var(--text-secondary)]">Premium Living Solutions</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">Home</a>
              <a href="#amenities" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">Amenities</a>
              <a href="#features" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">Features</a>
              <a href="#login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">Login</a>
            </nav>
            
            <div className="flex items-center space-x-3">
              <a href="admin-login.html" className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-gray-100 rounded-lg transition-colors">Admin</a>
              <a href="resident-login.html" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg transition-all">Resident</a>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}