function ResidentWaterSchedule() {
  const [schedule, setSchedule] = React.useState(null);

  React.useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('residentAuth') || '{}');
      if (!auth.building) return;
      
      const scheduleList = await trickleListObjects('water_schedule', 100, true);
      if (scheduleList && scheduleList.items) {
        const buildingSchedule = scheduleList.items.find(s => 
          s.objectData && s.objectData.building === auth.building
        );
        setSchedule(buildingSchedule);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  try {
    return (
      <div className="space-y-6" data-name="resident-water-schedule" data-file="components/ResidentWaterSchedule.js">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Water Supply Schedule</h2>

        {schedule ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <div className="icon-sunrise text-xl text-white"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Morning Supply</h3>
                  <p className="text-[var(--text-secondary)]">Daily water supply timing</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--primary-color)]">
                {schedule.objectData.morningStart} - {schedule.objectData.morningEnd}
              </p>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <div className="icon-sunset text-xl text-white"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Evening Supply</h3>
                  <p className="text-[var(--text-secondary)]">Daily water supply timing</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--primary-color)]">
                {schedule.objectData.eveningStart} - {schedule.objectData.eveningEnd}
              </p>
            </div>
          </div>
        ) : (
          <div className="card text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="icon-droplets text-2xl text-gray-400"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Schedule Set</h3>
            <p className="text-[var(--text-secondary)]">
              Water supply schedule has not been configured by the society admin yet.
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ResidentWaterSchedule component error:', error);
    return null;
  }
}