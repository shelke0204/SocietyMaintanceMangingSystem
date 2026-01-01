function Features() {
  try {
    const features = [
      {
        icon: 'shield-check',
        title: 'Secure Access Control',
        description: 'Advanced biometric and digital access management for enhanced security',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        icon: 'home',
        title: 'Smart Flat Management',
        description: 'Intelligent registration and tracking system for all residences',
        color: 'from-purple-500 to-pink-500'
      },
      {
        icon: 'credit-card',
        title: 'Digital Billing',
        description: 'Automated billing with multiple payment options and instant receipts',
        color: 'from-orange-500 to-red-500'
      },
      {
        icon: 'megaphone',
        title: 'Instant Notifications',
        description: 'Real-time alerts and announcements for all community updates',
        color: 'from-green-500 to-emerald-500'
      },
      {
        icon: 'message-circle',
        title: 'Quick Support',
        description: 'Efficient complaint management with priority-based resolution',
        color: 'from-indigo-500 to-blue-500'
      },
      {
        icon: 'smartphone',
        title: 'Mobile Optimized',
        description: 'Fully responsive design accessible from any device, anywhere',
        color: 'from-pink-500 to-rose-500'
      }
    ];

    return (
      <section id="features" className="py-20 bg-white" data-name="features" data-file="components/Features.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Everything you need to manage your society efficiently and effectively
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-[var(--secondary-color)] rounded-2xl hover:bg-white hover:shadow-luxury transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <div className={`icon-${feature.icon} text-2xl text-white`}></div>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Features component error:', error);
    return null;
  }
}