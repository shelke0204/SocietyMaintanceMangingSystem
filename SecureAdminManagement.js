function SecureAdminManagement() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [admins, setAdmins] = React.useState([]);
  const [currentAdmin, setCurrentAdmin] = React.useState(null);
  const [showPasswordForm, setShowPasswordForm] = React.useState(true);
  const [editingAdmin, setEditingAdmin] = React.useState(null);
  const [newPassword, setNewPassword] = React.useState('');
  const [showPasswordUpdate, setShowPasswordUpdate] = React.useState(false);
  const [passwordUpdateForm, setPasswordUpdateForm] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  React.useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
    setCurrentAdmin(auth);
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const developerList = await trickleListObjects('developer_credentials', 100, true);
      
      let isValid = false;
      
      if (developerList && developerList.items && developerList.items.length > 0) {
        // Check against database password
        const devCredential = developerList.items[0];
        isValid = devCredential.objectData && devCredential.objectData.password === password;
      } else {
        // Fallback to default password if no database entry exists
        isValid = password === 'Shelke@02';
      }
      
      if (isValid) {
        setIsAuthenticated(true);
        setShowPasswordForm(false);
        await loadAllAdmins();
      } else {
        alert('Access Denied – Only Developer Can Access');
        setPassword('');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      // Fallback to default password on error
      if (password === 'Shelke@02') {
        setIsAuthenticated(true);
        setShowPasswordForm(false);
        await loadAllAdmins();
      } else {
        alert('System error. Please try again or use default password.');
        setPassword('');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAllAdmins = async () => {
    setLoading(true);
    try {
      const adminList = await trickleListObjects('admin', 100, true);
      
      if (adminList && adminList.items && Array.isArray(adminList.items)) {
        setAdmins(adminList.items);
      } else {
        setAdmins([]);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
      setAdmins([]);
      alert('Unable to load admin list. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (adminId) => {
    if (!newPassword.trim()) {
      alert('Please enter a new password');
      return;
    }
    
    setLoading(true);
    try {
      const admin = admins.find(a => a.objectId === adminId);
      await trickleUpdateObject('admin', adminId, {
        ...admin.objectData,
        password: newPassword
      });
      
      setEditingAdmin(null);
      setNewPassword('');
      loadAllAdmins();
      alert('Admin password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeveloperPasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get current password from database
      const developerList = await trickleListObjects('developer_credentials', 100, true);
      
      let currentPassword = 'Shelke@02'; // Default password
      
      if (developerList && developerList.items && developerList.items.length > 0) {
        currentPassword = developerList.items[0].objectData.password;
      }
      
      // Validate old password
      if (passwordUpdateForm.oldPassword !== currentPassword) {
        alert('Old password is incorrect');
        setLoading(false);
        return;
      }
    
      // Validate new password matches confirm password
      if (passwordUpdateForm.newPassword !== passwordUpdateForm.confirmPassword) {
        alert('New password and confirm password do not match');
        setLoading(false);
        return;
      }
      
      // Validate new password length
      if (passwordUpdateForm.newPassword.length < 6) {
        alert('New password must be at least 6 characters');
        setLoading(false);
        return;
      }
      
      if (developerList && developerList.items && developerList.items.length > 0) {
        // Update existing developer credential
        const existingDev = developerList.items[0];
        await trickleUpdateObject('developer_credentials', existingDev.objectId, {
          ...existingDev.objectData,
          password: passwordUpdateForm.newPassword
        });
      } else {
        // Create new developer credential
        await trickleCreateObject('developer_credentials', {
          username: 'developer',
          password: passwordUpdateForm.newPassword,
          role: 'System Administrator'
        });
      }
      
      alert('Password updated successfully!');
      setShowPasswordUpdate(false);
      setPasswordUpdateForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      
      // Force re-authentication with new password
      setPassword('');
      setIsAuthenticated(false);
      setShowPasswordForm(true);
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  try {
    if (showPasswordForm) {
      return (
        <div className="max-w-md mx-auto" data-name="secure-admin-management" data-file="components/SecureAdminManagement.js">
          <div className="card">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="icon-shield text-2xl text-white"></div>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Developer Access Required</h2>
              <p className="text-[var(--text-secondary)] mt-2">Enter developer password to manage admin accounts</p>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Developer Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? 'Verifying...' : 'Access Admin Management'}
              </button>
              
              <div className="text-center mt-4">
                <p className="text-xs text-[var(--text-secondary)]">
                  Only authorized developers can access this section
                </p>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6" data-name="secure-admin-management" data-file="components/SecureAdminManagement.js">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Admin Management</h2>
            <p className="text-[var(--text-secondary)]">Developer access - Manage all admin accounts</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPasswordUpdate(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              Update Password
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setShowPasswordForm(true);
                setPassword('');
              }}
              className="btn-secondary"
            >
              Lock Access
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Current Admin (You)</h3>
          {currentAdmin && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-blue-900">Name</p>
                  <p className="text-blue-700">{currentAdmin.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Registration No.</p>
                  <p className="text-blue-700">{currentAdmin.registrationNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Building</p>
                  <p className="text-blue-700">{currentAdmin.building}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Login Time</p>
                  <p className="text-blue-700">{new Date(currentAdmin.loginTime).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">All System Admins</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Building</th>
                  <th className="pb-3">Registration No.</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Mobile</th>
                  <th className="pb-3">Password</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.objectId} className="border-b border-[var(--border-color)]">
                    <td className="py-4 font-medium">{admin.objectData.name}</td>
                    <td className="py-4">{admin.objectData.building}</td>
                    <td className="py-4 font-mono text-sm">{admin.objectData.registrationNo}</td>
                    <td className="py-4">{admin.objectData.email}</td>
                    <td className="py-4">{admin.objectData.mobile}</td>
                    <td className="py-4">
                      {editingAdmin === admin.objectId ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-32 px-2 py-1 border border-[var(--border-color)] rounded text-sm"
                            placeholder="New password"
                          />
                          <button
                            onClick={() => handlePasswordChange(admin.objectId)}
                            className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {admin.objectData.password}
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => {
                          setEditingAdmin(admin.objectId);
                          setNewPassword(admin.objectData.password);
                        }}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      >
                        Change Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showPasswordUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Update Developer Password</h3>
              <form onSubmit={handleDeveloperPasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Old Password</label>
                  <input
                    type="password"
                    value={passwordUpdateForm.oldPassword}
                    onChange={(e) => setPasswordUpdateForm({...passwordUpdateForm, oldPassword: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordUpdateForm.newPassword}
                    onChange={(e) => setPasswordUpdateForm({...passwordUpdateForm, newPassword: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordUpdateForm.confirmPassword}
                    onChange={(e) => setPasswordUpdateForm({...passwordUpdateForm, confirmPassword: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="btn-primary">
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordUpdate(false);
                      setPasswordUpdateForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('SecureAdminManagement component error:', error);
    return null;
  }
}
