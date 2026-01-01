function AdminRegisterForm() {
  const [formData, setFormData] = React.useState({
    name: '',
    building: '',
    registrationNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [successMessage, setSuccessMessage] = React.useState('');

  try {
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

    const validateRegistrationNo = (regNo) => {
      if (!regNo.trim()) return 'Registration number is required';
      return '';
    };

    const validateBuilding = (building) => {
      if (!building.trim()) return 'Building name is required';
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
      mobile: validateMobile(formData.mobile),
      registrationNo: validateRegistrationNo(formData.registrationNo),
      building: validateBuilding(formData.building),
      password: validatePassword(formData.password)
    };

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

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
      
      // Save admin data to Trickle database
      await trickleCreateObject('admin', {
          name: formData.name,
          building: formData.building,
          registrationNo: formData.registrationNo,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password
        });
        
        setSuccessMessage('Successfully Registered');
        setTimeout(() => {
          window.location.href = 'admin-login.html';
        }, 3000);
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
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

    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-[var(--border-color)] p-8" data-name="admin-register-form" data-file="components/AdminRegisterForm.js">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
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
          
          <div className="form-group">
            <label className="form-label">Building Name</label>
            <input
              type="text"
              name="building"
              value={formData.building}
              onChange={handleChange}
              className={`input-field ${errors.building ? 'border-red-500' : ''}`}
              required
            />
            {errors.building && <p className="text-red-500 text-sm mt-1">{errors.building}</p>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Registration Number (Unique)</label>
            <input
              type="text"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              className={`input-field ${errors.registrationNo ? 'border-red-500' : ''}`}
              placeholder="e.g., ADM001, SEC123"
              required
            />
            {errors.registrationNo && <p className="text-red-500 text-sm mt-1">{errors.registrationNo}</p>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Email (Gmail or Yahoo only)</label>
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
          
          <div className="form-group">
            <label className="form-label">Mobile Number (10 digits)</label>
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
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className=""
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <PasswordInput
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className=""
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center">
              {successMessage}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          
          <div className="text-center mt-4">
            <p className="text-[var(--text-secondary)]">
              Already have an account?{' '}
              <a href="admin-login.html" className="text-[var(--primary-color)] hover:underline">
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    );
  } catch (error) {
    console.error('AdminRegisterForm component error:', error);
    return null;
  }
}