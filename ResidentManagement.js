function ResidentManagement() {
  const [residents, setResidents] = React.useState([]);
  const [filteredResidents, setFilteredResidents] = React.useState([]);
  const [flats, setFlats] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [selectedBuilding, setSelectedBuilding] = React.useState('all');
  const [buildings, setBuildings] = React.useState([]);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    flatNumber: '',
    ownerType: 'owner',
    familyMembers: 1
  });
  const [loading, setLoading] = React.useState(false);
  const [editingResident, setEditingResident] = React.useState(null);
  const [editMobile, setEditMobile] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [successMessage, setSuccessMessage] = React.useState('');
  const [editingPassword, setEditingPassword] = React.useState(null);
  const [newPassword, setNewPassword] = React.useState('');

  React.useEffect(() => {
    loadResidents();
    loadFlats();
  }, []);

  const loadResidents = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      if (!auth.building) {
        console.log('No admin authentication found');
        return;
      }
      
      const residentList = await trickleListObjects('resident', 100, true);
      if (residentList && residentList.items && Array.isArray(residentList.items)) {
        // Filter to show only residents from the logged-in admin's building
        const buildingResidents = residentList.items.filter(r => 
          r.objectData && r.objectData.building === auth.building
        );
        setResidents(buildingResidents);
        setFilteredResidents(buildingResidents);
        
        // Since we're only showing one building, set it in buildings array
        setBuildings([auth.building]);
        setSelectedBuilding(auth.building);
      } else {
        setResidents([]);
        setFilteredResidents([]);
      }
    } catch (error) {
      console.error('Error loading residents:', error);
      setResidents([]);
      setFilteredResidents([]);
    }
  };



  const loadFlats = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      if (!auth.building) {
        console.log('No admin authentication found');
        return;
      }
      
      const flatList = await trickleListObjects('flat', 100, true);
      if (flatList && flatList.items && Array.isArray(flatList.items)) {
        const buildingFlats = flatList.items.filter(f => f.objectData && f.objectData.building === auth.building);
        setFlats(buildingFlats);
      } else {
        setFlats([]);
      }
    } catch (error) {
      console.error('Error loading flats:', error);
      setFlats([]);
    }
  };

  const validateName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name must contain only alphabets and spaces';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    if (!email.endsWith('.com')) return 'Email must end with .com';
    if (!email.includes('@gmail.com') && !email.includes('@yahoo.com')) {
      return 'Only Gmail and Yahoo emails are accepted';
    }
    return '';
  };

    const validateMobile = (mobile) => {
      if (!mobile.trim()) return 'Mobile number is required';
      if (!/^\d{10}$/.test(mobile)) return 'Mobile number must be exactly 10 digits';
      return '';
    };

    const validatePassword = (password) => {
      if (!password.trim()) return 'Password is required';
      if (password.length < 6) return 'Password must be at least 6 characters';
      if (!/[a-zA-Z]/.test(password)) return 'Password must contain at least 1 alphabet';
      if (!/[0-9]/.test(password)) return 'Password must contain at least 1 digit';
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least 1 special symbol (!@#$%^&* etc.)';
      return '';
    };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      mobile: validateMobile(formData.mobile)
    };

    if (!formData.flatNumber) newErrors.flatNumber = 'Flat selection is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if email already exists in admin table
      const adminList = await trickleListObjects('admin', 100, true);
      const emailExistsInAdmin = adminList.items.some(item => 
        item.objectData && item.objectData.email === formData.email
      );
      
      if (emailExistsInAdmin) {
        alert('This email is already registered.');
        setLoading(false);
        return;
      }
      
      // Check if mobile already exists in admin table
      const mobileExistsInAdmin = adminList.items.some(item => 
        item.objectData && item.objectData.mobile === formData.mobile
      );
      
      if (mobileExistsInAdmin) {
        alert('This mobile number is already registered.');
        setLoading(false);
        return;
      }
      
      // Check if email already exists in resident table
      const residentList = await trickleListObjects('resident', 100, true);
      const emailExistsInResident = residentList.items.some(item => 
        item.objectData && item.objectData.email === formData.email
      );
      
      if (emailExistsInResident) {
        alert('This email is already registered.');
        setLoading(false);
        return;
      }
      
      // Check if mobile already exists in resident table
      const mobileExistsInResident = residentList.items.some(item => 
        item.objectData && item.objectData.mobile === formData.mobile
      );
      
      if (mobileExistsInResident) {
        alert('This mobile number is already registered.');
        setLoading(false);
        return;
      }
      
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      await trickleCreateObject('resident', {
        ...formData,
        building: auth.building,
        familyMembers: parseInt(formData.familyMembers)
      });
      
      // Update flat status to occupied
      const selectedFlat = flats.find(f => f.objectData.flatNumber === formData.flatNumber);
      if (selectedFlat) {
        await trickleUpdateObject('flat', selectedFlat.objectId, {
          ...selectedFlat.objectData,
          status: 'occupied'
        });
      }
      
      setFormData({
        name: '', email: '', mobile: '', password: '', flatNumber: '',
        ownerType: 'owner', familyMembers: 1
      });
      setErrors({});
      setSuccessMessage('Successfully Registered');
      setTimeout(() => {
        setShowForm(false);
        setSuccessMessage('');
      }, 3000);
      loadResidents();
      loadFlats();
    } catch (error) {
      console.error('Error creating resident:', error);
      alert('Failed to register resident');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveResident = async (residentId, flatNumber) => {
    if (!confirm('Are you sure you want to remove this resident? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      await trickleDeleteObject('resident', residentId);
      
      // Update flat status to vacant
      const selectedFlat = flats.find(f => f.objectData.flatNumber === flatNumber);
      if (selectedFlat) {
        await trickleUpdateObject('flat', selectedFlat.objectId, {
          ...selectedFlat.objectData,
          status: 'vacant'
        });
      }
      
      loadResidents();
      loadFlats();
      alert('Resident removed successfully!');
    } catch (error) {
      console.error('Error removing resident:', error);
      alert('Failed to remove resident');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateMobile = async (residentId, newMobile) => {
    const mobileError = validateMobile(newMobile);
    if (mobileError) {
      alert(mobileError);
      return;
    }
    
    setLoading(true);
    try {
      const resident = residents.find(r => r.objectId === residentId);
      await trickleUpdateObject('resident', residentId, {
        ...resident.objectData,
        mobile: newMobile
      });
      
      setEditingResident(null);
      setEditMobile('');
      loadResidents();
      alert('Mobile number updated successfully!');
    } catch (error) {
      console.error('Error updating mobile:', error);
      alert('Failed to update mobile number');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (residentId, password) => {
    const passwordError = validatePassword(password);
    if (passwordError) {
      alert(passwordError);
      return;
    }
    
    setLoading(true);
    try {
      const resident = residents.find(r => r.objectId === residentId);
      await trickleUpdateObject('resident', residentId, {
        ...resident.objectData,
        password: password
      });
      
      setEditingPassword(null);
      setNewPassword('');
      loadResidents();
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="resident-management" data-file="components/ResidentManagement.js">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Resident Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <div className="icon-user-plus text-lg mr-2"></div>
            Register New Resident
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Register New Resident</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email (Gmail or Yahoo only)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="example@gmail.com"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mobile (10 digits)</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`input-field ${errors.mobile ? 'border-red-500' : ''}`}
                  placeholder="9876543210"
                  maxLength="10"
                  required
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                  required
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Flat Number</label>
                <select
                  name="flatNumber"
                  value={formData.flatNumber}
                  onChange={handleChange}
                  className={`input-field ${errors.flatNumber ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select Flat</option>
                  {flats.filter(f => f.objectData.status === 'vacant').map(flat => (
                    <option key={flat.objectId} value={flat.objectData.flatNumber}>
                      {flat.objectData.flatNumber} - {flat.objectData.flatType}
                    </option>
                  ))}
                </select>
                {errors.flatNumber && <p className="text-red-500 text-sm mt-1">{errors.flatNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Owner Type</label>
                <select
                  name="ownerType"
                  value={formData.ownerType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Family Members</label>
                <input
                  type="number"
                  name="familyMembers"
                  value={formData.familyMembers}
                  onChange={handleChange}
                  className="input-field"
                  min="1"
                  max="20"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Society/Building</label>
                <input
                  type="text"
                  value={JSON.parse(localStorage.getItem('adminAuth') || '{}').building || ''}
                  className="input-field bg-gray-100"
                  disabled
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">Auto-filled from your admin profile</p>
              </div>
              
              {successMessage && (
                <div className="md:col-span-2 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center">
                  {successMessage}
                </div>
              )}
              
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Registering...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Registered Residents - {JSON.parse(localStorage.getItem('adminAuth') || '{}').building}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Society/Building</th>
                  <th className="pb-2">Flat</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Mobile</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Family</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResidents.map((resident) => (
                  <tr key={resident.objectId} className="border-b border-[var(--border-color)]">
                    <td className="py-3 font-medium">{resident.objectData.name}</td>
                    <td className="py-3 font-medium">{resident.objectData.building}</td>
                    <td className="py-3">{resident.objectData.flatNumber}</td>
                    <td className="py-3">{resident.objectData.email}</td>
                    <td className="py-3">
                      {editingResident === resident.objectId ? (
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            value={editMobile}
                            onChange={(e) => setEditMobile(e.target.value)}
                            className="w-32 px-2 py-1 border border-[var(--border-color)] rounded text-sm"
                          />
                          <button
                            onClick={() => handleUpdateMobile(resident.objectId, editMobile)}
                            className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span>{resident.objectData.mobile}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        resident.objectData.ownerType === 'owner' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {resident.objectData.ownerType}
                      </span>
                    </td>
                    <td className="py-3">{resident.objectData.familyMembers}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => {
                            setEditingResident(resident.objectId);
                            setEditMobile(resident.objectData.mobile);
                          }}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        >
                          Edit Mobile
                        </button>
                        <button
                          onClick={() => {
                            setEditingPassword(resident.objectId);
                            setNewPassword('');
                          }}
                          className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                        >
                          Reset Password
                        </button>
                        <button
                          onClick={() => handleRemoveResident(resident.objectId, resident.objectData.flatNumber)}
                          disabled={loading}
                          className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {editingPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
              <div className="space-y-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter new password"
                />
                <p className="text-xs text-[var(--text-secondary)]">
                  Password must contain: 1 alphabet, 1 digit, 1 special symbol
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleUpdatePassword(editingPassword, newPassword)}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  onClick={() => {
                    setEditingPassword(null);
                    setNewPassword('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ResidentManagement component error:', error);
    return null;
  }
}
