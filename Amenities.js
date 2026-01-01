function Amenities() {
  try {
    const amenities = [
      {
        title: 'State-of-Art Gym',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        description: 'Premium equipment and personal training facilities'
      },
      {
        title: 'Infinity Pool',
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        description: 'Rooftop swimming pool with panoramic city views'
      },
      {
        title: 'Landscaped Gardens',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        description: 'Serene green spaces with walking paths'
      },
      {
        title: 'Premium Clubhouse',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        description: 'Elegant social spaces for community events'
      },
      {
        title: '24/7 Security',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        description: 'Advanced security systems and trained personnel'
      },
      {
        title: 'Smart Parking',
        image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        description: 'Automated parking with ample space'
      }
    ];

    return (
      <section id="amenities" className="py-20 bg-[var(--secondary-color)]" data-name="amenities" data-file="components/Amenities.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              World-Class Amenities
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Experience luxury living with our premium facilities designed for your comfort
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => (
              <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-luxury transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={amenity.image} 
                    alt={amenity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{amenity.title}</h3>
                  <p className="text-[var(--text-secondary)]">{amenity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Amenities component error:', error);
    return null;
  }
}