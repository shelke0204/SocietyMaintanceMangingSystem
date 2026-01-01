function Hero() {
  try {
    return (
      <section 
        id="home" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        data-name="hero" 
        data-file="components/Hero.js"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
            filter: 'brightness(0.4)'
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Luxury Society
              <br />
              <span className="text-gradient">Management System</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience premium living with our comprehensive management platform. 
              Seamless operations, exceptional service, modern amenities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="admin-register.html" className="group px-8 py-4 bg-white text-[var(--primary-color)] rounded-xl font-semibold text-lg hover:shadow-luxury transition-all flex items-center">
                <div className="icon-user-plus text-xl mr-3"></div>
                Register as Admin
                <div className="icon-arrow-right text-lg ml-3 group-hover:translate-x-1 transition-transform"></div>
              </a>
              <a href="#amenities" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-[var(--primary-color)] transition-all">
                Explore Amenities
              </a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="icon-chevron-down text-3xl text-white opacity-75"></div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}