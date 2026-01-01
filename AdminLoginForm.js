function AdminLoginForm() {
  const [formData, setFormData] = React.useState({
    registrationNo: '',
    password: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        // Get all admins from database
        const adminList = await trickleListObjects('admin', 100, true);
        
        // Find admin with matching registration number and password
        const admin = adminList.items.find(item => 
          item.objectData.registrationNo === formData.registrationNo && 
          item.objectData.password === formData.password
        );
        
        if (admin) {
          const authData = {
            objectId: admin.objectId,
            registrationNo: admin.objectData.registrationNo,
            name: admin.objectData.name,
            building: admin.objectData.building,
            loginTime: new Date().toISOString()
          };
          
          localStorage.setItem('adminAuth', JSON.stringify(authData));
          SessionManager.initSession('admin', admin.objectId);
          
          window.location.href = 'admin-dashboard.html';
        } else {
          alert('Invalid registration number or password.');
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
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-[var(--border-color)] p-8" data-name="admin-login-form" data-file="components/AdminLoginForm.js">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="icon-user-check text-2xl text-white"></div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Admin Login</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Registration Number</label>
            <input
              type="text"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your registration number"
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
              Don't have an account?{' '}
              <a href="admin-register.html" className="text-[var(--primary-color)] hover:underline">
                Register here
              </a>
            </p>
          </div>
        </form>
        
        <ForgotPasswordModal 
          isOpen={showForgotPassword} 
          onClose={() => setShowForgotPassword(false)}
          userType="admin"
        />
      </div>
    );
}
