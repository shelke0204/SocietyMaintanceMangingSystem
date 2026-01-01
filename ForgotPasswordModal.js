function ForgotPasswordModal({ isOpen, onClose, userType }) {
  const [step, setStep] = React.useState('choose'); // choose, otp, developer, success
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [generatedOTP, setGeneratedOTP] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [developerPassword, setDeveloperPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [userId, setUserId] = React.useState('');

  try {
    if (!isOpen) return null;

    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleSendOTP = async () => {
      if (!email.trim()) {
        alert('Please enter your email address');
        return;
      }

      setLoading(true);
      try {
        let userList;
        if (userType === 'admin') {
          userList = await trickleListObjects('admin', 100, true);
        } else {
          userList = await trickleListObjects('resident', 100, true);
        }

        const user = userList.items.find(u => u.objectData && u.objectData.email === email);
        
        if (!user) {
          alert('Email not found in our system');
          setLoading(false);
          return;
        }

        const otp = generateOTP();
        setGeneratedOTP(otp);
        setUserId(user.objectId);
        setStep('otp');
        alert(`OTP sent to ${email}: ${otp}\n\nNote: In production, this would be sent via email/SMS`);
      } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const handleVerifyOTP = async () => {
      if (otp !== generatedOTP) {
        alert('Invalid OTP. Please try again.');
        return;
      }

      if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }

      setLoading(true);
      try {
        let user;
        if (userType === 'admin') {
          user = await trickleGetObject('admin', userId);
          await trickleUpdateObject('admin', userId, {
            ...user.objectData,
            password: newPassword
          });
        } else {
          user = await trickleGetObject('resident', userId);
          await trickleUpdateObject('resident', userId, {
            ...user.objectData,
            password: newPassword
          });
        }

        setStep('success');
      } catch (error) {
        console.error('Error resetting password:', error);
        alert('Failed to reset password. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const handleDeveloperReset = async () => {
      setLoading(true);
      try {
        const developerList = await trickleListObjects('developer_credentials', 100, true);
        let validPassword = 'Shelke@02';
        
        if (developerList && developerList.items && developerList.items.length > 0) {
          validPassword = developerList.items[0].objectData.password;
        }

        if (developerPassword !== validPassword) {
          alert('Invalid developer password');
          setLoading(false);
          return;
        }

        if (!email.trim()) {
          alert('Please enter the user email');
          setLoading(false);
          return;
        }

        let userList;
        if (userType === 'admin') {
          userList = await trickleListObjects('admin', 100, true);
        } else {
          userList = await trickleListObjects('resident', 100, true);
        }

        const user = userList.items.find(u => u.objectData && u.objectData.email === email);
        
        if (!user) {
          alert('Email not found');
          setLoading(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          alert('Passwords do not match');
          setLoading(false);
          return;
        }

        if (newPassword.length < 6) {
          alert('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        if (userType === 'admin') {
          await trickleUpdateObject('admin', user.objectId, {
            ...user.objectData,
            password: newPassword
          });
        } else {
          await trickleUpdateObject('resident', user.objectId, {
            ...user.objectData,
            password: newPassword
          });
        }

        setStep('success');
      } catch (error) {
        console.error('Error resetting password:', error);
        alert('Failed to reset password.');
      } finally {
        setLoading(false);
      }
    };

    const resetForm = () => {
      setStep('choose');
      setEmail('');
      setOtp('');
      setGeneratedOTP('');
      setNewPassword('');
      setConfirmPassword('');
      setDeveloperPassword('');
      setUserId('');
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full">
          {step === 'choose' && (
            <>
              <h3 className="text-xl font-bold mb-4">Forgot Password</h3>
              <p className="text-[var(--text-secondary)] mb-6">Choose a recovery method:</p>
              <div className="space-y-3">
                <button
                  onClick={() => setStep('otp')}
                  className="w-full flex items-center p-4 border-2 border-[var(--border-color)] rounded-lg hover:border-[var(--primary-color)] transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <div className="icon-mail text-lg text-blue-600"></div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">OTP Recovery</p>
                    <p className="text-sm text-[var(--text-secondary)]">Reset via email OTP</p>
                  </div>
                </button>
                <button
                  onClick={() => setStep('developer')}
                  className="w-full flex items-center p-4 border-2 border-[var(--border-color)] rounded-lg hover:border-[var(--primary-color)] transition-colors"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <div className="icon-shield text-lg text-red-600"></div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Developer Access</p>
                    <p className="text-sm text-[var(--text-secondary)]">Reset with developer password</p>
                  </div>
                </button>
              </div>
              <button onClick={onClose} className="w-full mt-4 btn-secondary">Cancel</button>
            </>
          )}

          {step === 'otp' && !generatedOTP && (
            <>
              <h3 className="text-xl font-bold mb-4">OTP Recovery</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>
                <button onClick={handleSendOTP} disabled={loading} className="w-full btn-primary">
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
                <button onClick={() => setStep('choose')} className="w-full btn-secondary">Back</button>
              </div>
            </>
          )}

          {step === 'otp' && generatedOTP && (
            <>
              <h3 className="text-xl font-bold mb-4">Verify OTP</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                  />
                </div>
                <div>
                  <PasswordInput
                    label="New Password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <button onClick={handleVerifyOTP} disabled={loading} className="w-full btn-primary">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </>
          )}

          {step === 'developer' && (
            <>
              <h3 className="text-xl font-bold mb-4">Developer Access Reset</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">User Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="Enter user email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Developer Password</label>
                  <PasswordInput
                    name="developerPassword"
                    value={developerPassword}
                    onChange={(e) => setDeveloperPassword(e.target.value)}
                    placeholder="Enter developer password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <PasswordInput
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <PasswordInput
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <button onClick={handleDeveloperReset} disabled={loading} className="w-full btn-primary">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button onClick={() => setStep('choose')} className="w-full btn-secondary">Back</button>
              </div>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="icon-check text-2xl text-green-600"></div>
                </div>
                <h3 className="text-xl font-bold mb-2">Password Reset Successful!</h3>
                <p className="text-[var(--text-secondary)] mb-6">You can now login with your new password</p>
                <button onClick={resetForm} className="btn-primary">Close</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ForgotPasswordModal error:', error);
    return null;
  }
}