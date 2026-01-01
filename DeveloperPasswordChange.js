function DeveloperPasswordChange() {
  const [formData, setFormData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = React.useState(false);

  try {
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (formData.newPassword !== formData.confirmPassword) {
        alert('New passwords do not match');
        return;
      }
      
      if (formData.newPassword.length < 6) {
        alert('New password must be at least 6 characters');
        return;
      }
      
      setLoading(true);
      
      try {
        const auth = JSON.parse(localStorage.getItem('developerAuth') || '{}');
        
        // Get current developer credentials
        const developerList = await trickleListObjects('developer_credentials', 100, true);
        const currentDeveloper = developerList.items.find(d => d.objectId === auth.objectId);
        
        if (!currentDeveloper || currentDeveloper.objectData.password !== formData.currentPassword) {
          alert('Current password is incorrect');
          return;
        }
        
        // Update password
        await trickleUpdateObject('developer_credentials', auth.objectId, {
          ...currentDeveloper.objectData,
          password: formData.newPassword
        });
        
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Developer password updated successfully!');
        
        // Force logout for security
        setTimeout(() => {
          localStorage.removeItem('developerAuth');
          window.location.href = 'developer-login.html';
        }, 2000);
        
      } catch (error) {
        console.error('Error updating password:', error);
        alert('Failed to update password');
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
      <div className="card max-w-md" data-name="developer-password-change" data-file="components/DeveloperPasswordChange.js">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Change Developer Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Security Notice:</strong> You will be automatically logged out after password change for security purposes.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DeveloperPasswordChange component error:', error);
    return null;
  }
}