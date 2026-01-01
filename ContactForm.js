function ContactForm() {
  const [societies, setSocieties] = React.useState([]);
  const [formData, setFormData] = React.useState({
    society: '',
    subject: '',
    description: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    loadSocieties();
  }, []);

  const loadSocieties = async () => {
    try {
      const adminList = await trickleListObjects('admin', 100, true);
      if (adminList && adminList.items && Array.isArray(adminList.items)) {
        const uniqueSocieties = [...new Set(adminList.items
          .filter(a => a.objectData && a.objectData.building)
          .map(a => a.objectData.building))];
        setSocieties(uniqueSocieties);
      } else {
        setSocieties([]);
      }
    } catch (error) {
      console.error('Error loading societies:', error);
      setSocieties([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.society.trim()) {
      newErrors.society = 'Please select a society';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await trickleCreateObject('feedback', {
        society: formData.society,
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        submittedAt: new Date().toISOString()
      });
      
      setFormData({ society: '', subject: '', description: '' });
      setErrors({});
      setSuccessMessage('Thank You!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  try {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-luxury border border-[var(--border-color)] p-8" data-name="contact-form" data-file="components/ContactForm.js">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="icon-message-square text-3xl text-white"></div>
          </div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Send Feedback</h2>
          <p className="text-[var(--text-secondary)]">Contact your society administration</p>
        </div>

        {successMessage ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="icon-check text-3xl text-green-600"></div>
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">{successMessage}</h3>
            <p className="text-[var(--text-secondary)] mb-6">Your feedback has been submitted successfully!</p>
            <button
              onClick={() => window.location.href = 'index.html'}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Society</label>
              <select
                name="society"
                value={formData.society}
                onChange={handleChange}
                className={`input-field ${errors.society ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Choose a society</option>
                {societies.map((society, index) => (
                  <option key={index} value={society}>{society}</option>
                ))}
              </select>
              {errors.society && <p className="text-red-500 text-sm mt-1">{errors.society}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
                placeholder="Enter subject"
                required
              />
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                rows="4"
                placeholder="Describe your feedback or concern"
                required
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading || societies.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
            
            {societies.length === 0 && (
              <p className="text-center text-sm text-[var(--text-secondary)] mt-2">
                Loading societies...
              </p>
            )}
          </form>
        )}
      </div>
    );
  } catch (error) {
    console.error('ContactForm component error:', error);
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-[var(--border-color)] p-8 text-center">
        <p className="text-red-600">Error loading contact form. Please refresh the page.</p>
      </div>
    );
  }
}