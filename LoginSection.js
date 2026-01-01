function LoginSection() {
  try {
    return (
      <section id="login" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800" data-name="login-section" data-file="components/LoginSection.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Access Your Portal
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your role to access the management system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="group bg-white rounded-2xl p-8 hover:shadow-luxury transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="icon-user-check text-3xl text-white"></div>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-3">Secretary/Admin</h3>
              <p className="text-[var(--text-secondary)] text-center mb-6 leading-relaxed">
                Manage residents, bills, notices, and handle all administrative operations
              </p>
              <div className="space-y-3">
                <a href="admin-login.html" className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-xl font-semibold hover:shadow-lg transition-all">
                  Admin Login
                </a>
                <a href="admin-register.html" className="block w-full py-3 bg-[var(--secondary-color)] text-[var(--text-primary)] text-center rounded-xl font-semibold hover:bg-gray-100 transition-all">
                  Register as Admin
                </a>
              </div>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 hover:shadow-luxury transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="icon-users text-3xl text-white"></div>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-3">Resident Portal</h3>
              <p className="text-[var(--text-secondary)] text-center mb-6 leading-relaxed">
                View bills, check notices, submit complaints, and stay updated with society activities
              </p>
              <div className="space-y-3">
                <a href="resident-login.html" className="block w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center rounded-xl font-semibold hover:shadow-lg transition-all">
                  Resident Login
                </a>
                <p className="text-sm text-[var(--text-secondary)] text-center">
                  Registration handled by society admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('LoginSection component error:', error);
    return null;
  }
}