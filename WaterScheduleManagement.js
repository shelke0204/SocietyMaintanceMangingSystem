function WaterScheduleManagement() {
  const [schedule, setSchedule] = React.useState({
    morningStart: '06:00 AM',
    morningEnd: '09:00 AM',
    eveningStart: '06:00 PM',
    eveningEnd: '08:00 PM'
  });
  const [loading, setLoading] = React.useState(false);
  const [currentSchedule, setCurrentSchedule] = React.useState(null);

  React.useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      if (!auth.building) return;
      
      const scheduleList = await trickleListObjects('water_schedule', 100, true);
      if (scheduleList && scheduleList.items) {
        const buildingSchedule = scheduleList.items.find(s => 
          s.objectData && s.objectData.building === auth.building
        );
        if (buildingSchedule) {
          setCurrentSchedule(buildingSchedule);
          setSchedule(buildingSchedule.objectData);
        }
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const auth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
      const scheduleData = {
        ...schedule,
        building: auth.building,
        adminId: auth.registrationNo
      };

      if (currentSchedule) {
        await trickleUpdateObject('water_schedule', currentSchedule.objectId, scheduleData);
      } else {
        await trickleCreateObject('water_schedule', scheduleData);
      }
      
      loadSchedule();
      alert('Water schedule updated successfully!');
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('Failed to update schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!confirm('Are you sure you want to delete the water schedule?')) return;
    
    setLoading(true);
    try {
      if (currentSchedule) {
        await trickleDeleteObject('water_schedule', currentSchedule.objectId);
        setCurrentSchedule(null);
        setSchedule({
          morningStart: '06:00 AM',
          morningEnd: '09:00 AM',
          eveningStart: '06:00 PM',
          eveningEnd: '08:00 PM'
        });
        alert('Water schedule deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Failed to delete schedule');
    } finally {
      setLoading(false);
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="water-schedule-management" data-file="components/WaterScheduleManagement.js">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Water Supply Schedule</h2>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Set Water Supply Timings</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Morning Start Time</label>
                <input
                  type="text"
                  value={schedule.morningStart}
                  onChange={(e) => setSchedule({...schedule, morningStart: e.target.value})}
                  className="input-field"
                  placeholder="e.g., 06:00 AM"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Morning End Time</label>
                <input
                  type="text"
                  value={schedule.morningEnd}
                  onChange={(e) => setSchedule({...schedule, morningEnd: e.target.value})}
                  className="input-field"
                  placeholder="e.g., 09:00 AM"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Evening Start Time</label>
                <input
                  type="text"
                  value={schedule.eveningStart}
                  onChange={(e) => setSchedule({...schedule, eveningStart: e.target.value})}
                  className="input-field"
                  placeholder="e.g., 06:00 PM"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Evening End Time</label>
                <input
                  type="text"
                  value={schedule.eveningEnd}
                  onChange={(e) => setSchedule({...schedule, eveningEnd: e.target.value})}
                  className="input-field"
                  placeholder="e.g., 08:00 PM"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Save Schedule'}
              </button>
              {currentSchedule && (
                <button
                  type="button"
                  onClick={handleDeleteSchedule}
                  disabled={loading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Schedule
                </button>
              )}
            </div>
          </form>
        </div>

        {currentSchedule && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Current Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--secondary-color)] p-4 rounded-lg">
                <h4 className="font-medium mb-2">Morning Supply</h4>
                <p className="text-[var(--text-secondary)]">
                  {schedule.morningStart} - {schedule.morningEnd}
                </p>
              </div>
              <div className="bg-[var(--secondary-color)] p-4 rounded-lg">
                <h4 className="font-medium mb-2">Evening Supply</h4>
                <p className="text-[var(--text-secondary)]">
                  {schedule.eveningStart} - {schedule.eveningEnd}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('WaterScheduleManagement component error:', error);
    return null;
  }
}