function DeveloperLoginForm() {
  const [formData, setFormData] = React.useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = React.useState(false);

  try {
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        // Get developer credentials from database
        const developerList = await trickleListObjects('developer_credentials', 100, true);
        
        if (!developerList || !developerList.items) {
          alert('System error. Please contact support.');
          return;
        }
        
        // Find developer with matching credentials
        const developer = developerList.items.find(item => 
          item.objectData && 
          item.objectData.username === formData.username && 
          item.objectData.password === formData.password
        );
        
        if (developer) {
          localStorage.setItem('developerAuth', JSON.stringify({
            objectId: developer.objectId,
            username: developer.objectData.username,
            role: developer.objectData.role,
            loginTime: new Date().toISOString()
          }));
          
          window.location.href = 'developer-dashboard.html';
        } else {
          alert('Invalid credentials. Access denied.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-[var(--border-color)] p-8" data-name="developer-login-form" data-file="components/DeveloperLoginForm.js">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="icon-shield text-2xl text-white"></div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Developer Access</h2>
          <p className="text-[var(--text-secondary)]">Secure System Administration</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter developer username"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter developer password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Authenticating...' : 'Access System'}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-xs text-[var(--text-secondary)]">
              Authorized personnel only. All access is logged and monitored.
            </p>
          </div>
        </form>
      </div>
    );
  } catch (error) {
    console.error('DeveloperLoginForm component error:', error);
    return null;
  }
}