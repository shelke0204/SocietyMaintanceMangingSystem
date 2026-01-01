function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      if (!auth.building) {
        console.log('No admin authentication found');
        return;
      }
      
      const feedbackList = await trickleListObjects('feedback', 100, true);
      if (feedbackList && feedbackList.items && Array.isArray(feedbackList.items)) {
        const buildingFeedbacks = feedbackList.items.filter(f => 
          f.objectData && f.objectData.society === auth.building
        );
        setFeedbacks(buildingFeedbacks);
      } else {
        setFeedbacks([]);
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      setFeedbacks([]);
    }
  };

  const deleteFeedback = async (feedbackId) => {
    if (!confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      await trickleDeleteObject('feedback', feedbackId);
      loadFeedbacks();
      alert('Feedback deleted successfully!');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback');
    } finally {
      setLoading(false);
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="feedback-management" data-file="components/FeedbackManagement.js">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Feedback & Contact</h2>
          <button
            onClick={loadFeedbacks}
            className="btn-secondary inline-flex items-center"
            disabled={loading}
          >
            <div className="icon-refresh-cw text-lg mr-2"></div>
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {feedbacks.map((feedback) => (
            <div key={feedback.objectId} className="card group">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <div className="icon-message-square text-xl text-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{feedback.objectData.subject}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <span className="font-medium">Society:</span> {feedback.objectData.society}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl mb-4 border border-purple-100">
                <p className="text-[var(--text-primary)] leading-relaxed">{feedback.objectData.description}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-[var(--text-secondary)]">
                  <p><strong>Submitted:</strong> {new Date(feedback.objectData.submittedAt || feedback.createdAt).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {new Date(feedback.objectData.submittedAt || feedback.createdAt).toLocaleTimeString()}</p>
                </div>
                <button
                  onClick={() => deleteFeedback(feedback.objectId)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {feedbacks.length === 0 && (
            <div className="col-span-2 text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="icon-message-square text-4xl text-purple-600"></div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">No Feedback Yet</h3>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                No feedback has been received for your society yet. Feedback from residents will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('FeedbackManagement component error:', error);
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading feedback. Please refresh the page.</p>
      </div>
    );
  }
}