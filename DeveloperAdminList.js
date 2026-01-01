function DeveloperAdminList() {
  const [admins, setAdmins] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [editingAdmin, setEditingAdmin] = React.useState(null);
  const [newPassword, setNewPassword] = React.useState('');

  React.useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
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
      loadAdmins();
      alert('Admin password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      await trickleDeleteObject('admin', adminId);
      loadAdmins();
      alert('Admin deleted successfully!');
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin');
    } finally {
      setLoading(false);
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="developer-admin-list" data-file="components/DeveloperAdminList.js">
        <div className="card">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">All System Admins</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Building/Society</th>
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAdmin(admin.objectId);
                            setNewPassword(admin.objectData.password);
                          }}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        >
                          Change Password
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.objectId)}
                          disabled={loading}
                          className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-[var(--text-secondary)]">
                      No admins found in the system
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DeveloperAdminList component error:', error);
    return null;
  }
}