function Footer() {
  try {
    return (
      <footer className="bg-slate-900 text-gray-300" data-name="footer" data-file="components/Footer.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <div className="icon-building text-2xl text-white"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Society Manager</h3>
                  <p className="text-sm text-gray-400">Premium Living Solutions</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Transform your residential society with our comprehensive management platform. 
                Streamline operations, enhance communication, and deliver exceptional living experiences.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#amenities" className="hover:text-white transition-colors">Amenities</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="admin-login.html" className="hover:text-white transition-colors">Admin Portal</a></li>
                <li><a href="resident-login.html" className="hover:text-white transition-colors">Resident Portal</a></li>
                <li><a href="contact.html" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="icon-mail text-lg mt-1"></div>
                  <span className="text-sm">saurabhshelke0204@gmail.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="icon-phone text-lg mt-1"></div>
                  <span className="text-sm">+91 9372556506</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 Society Maintenance Managing System. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}