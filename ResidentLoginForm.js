function ResidentLoginForm() {
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        // Get all residents from database
        const residentList = await trickleListObjects('resident', 100, true);
        
        if (!residentList || !residentList.items) {
          alert('Unable to connect to database. Please try again.');
          return;
        }
        
        // Find resident with matching email and password
        const resident = residentList.items.find(item => 
          item.objectData && 
          item.objectData.email === formData.email && 
          item.objectData.password === formData.password
        );
        
        if (resident) {
          const authData = {
            objectId: resident.objectId,
            email: resident.objectData.email,
            name: resident.objectData.name,
            flatNumber: resident.objectData.flatNumber,
            building: resident.objectData.building,
            loginTime: new Date().toISOString()
          };
          
          localStorage.setItem('residentAuth', JSON.stringify(authData));
          SessionManager.initSession('resident', resident.objectId);
          
          window.location.href = 'resident-dashboard.html';
        } else {
          alert('Invalid email or password.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
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
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-[var(--border-color)] p-8" data-name="resident-login-form" data-file="components/ResidentLoginForm.js">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[var(--accent-color)] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="icon-users text-2xl text-white"></div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Resident Login</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-[var(--primary-color)] hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>
          
          <div className="text-center mt-2">
            <p className="text-[var(--text-secondary)]">
              Need help? Contact your building administrator
            </p>
          </div>
        </form>
        
        <ForgotPasswordModal 
          isOpen={showForgotPassword} 
          onClose={() => setShowForgotPassword(false)}
          userType="resident"
        />
      </div>
    );
}
