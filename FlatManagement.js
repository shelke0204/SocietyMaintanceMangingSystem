function FlatManagement() {
  const [flats, setFlats] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    flatNumber: '',
    floor: '',
    flatType: '2BHK',
    area: '',
    status: 'vacant'
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadFlats();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      await trickleCreateObject('flat', {
        ...formData,
        building: auth.building,
        floor: parseInt(formData.floor),
        area: parseInt(formData.area)
      });
      
      setFormData({ flatNumber: '', floor: '', flatType: '2BHK', area: '', status: 'vacant' });
      setShowForm(false);
      loadFlats();
      alert('Flat registered successfully!');
    } catch (error) {
      console.error('Error creating flat:', error);
      alert('Failed to register flat');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlat = async (flatId) => {
    if (!confirm('Are you sure you want to delete this flat? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      await trickleDeleteObject('flat', flatId);
      loadFlats();
      alert('Flat deleted successfully!');
    } catch (error) {
      console.error('Error deleting flat:', error);
      alert('Failed to delete flat');
    } finally {
      setLoading(false);
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="flat-management" data-file="components/FlatManagement.js">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Flat Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <div className="icon-plus text-lg mr-2"></div>
            Register New Flat
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Register New Flat</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Flat Number</label>
                <input
                  type="text"
                  value={formData.flatNumber}
                  onChange={(e) => setFormData({...formData, flatNumber: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Floor</label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({...formData, floor: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Flat Type</label>
                <select
                  value={formData.flatType}
                  onChange={(e) => setFormData({...formData, flatType: e.target.value})}
                  className="input-field"
                >
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="4BHK">4BHK</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Area (sq ft)</label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Registering...' : 'Register Flat'}
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
          <h3 className="text-lg font-semibold mb-4">Registered Flats</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="pb-2">Flat Number</th>
                  <th className="pb-2">Floor</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Area</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flats.map((flat) => (
                  <tr key={flat.objectId} className="border-b border-[var(--border-color)]">
                    <td className="py-3 font-medium">{flat.objectData.flatNumber}</td>
                    <td className="py-3">{flat.objectData.floor}</td>
                    <td className="py-3">{flat.objectData.flatType}</td>
                    <td className="py-3">{flat.objectData.area} sq ft</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        flat.objectData.status === 'occupied' ? 'bg-green-100 text-green-800' :
                        flat.objectData.status === 'vacant' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {flat.objectData.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleDeleteFlat(flat.objectId)}
                        disabled={loading}
                        className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('FlatManagement component error:', error);
    return null;
  }
}