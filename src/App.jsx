// App.jsx
import { useState, useEffect } from 'react';
import VehicleMap from './components/VehicleMap';
import VehicleControls from './components/VehicleControls';
import useVehicleTracking from './hooks/useVehicleTracking';

function App() {
  const [mapType, setMapType] = useState('map');

  const {
    routeData,
    currentIndex,
    currentPosition,
    currentData,
    previousData,
    isPlaying,
    speed,
    routePath,
    fullRoute,
    togglePlay,
    reset,
    setSpeed
  } = useVehicleTracking();

  // Auto play once data loads
  useEffect(() => {
    if (routeData.length > 0) togglePlay();
  }, [routeData]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
        <VehicleControls
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onReset={reset}
        currentIndex={currentIndex}
        totalPoints={routeData.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />
      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0">
        <VehicleMap
          currentPosition={currentPosition}
          routePath={routePath}
          fullRoute={fullRoute}
          isPlaying={isPlaying}
          mapType={mapType}
        />
      </div>

      {/* Map Type Toggle (Top Left) */}
      <div className="absolute z-40 overflow-hidden bg-white rounded-lg shadow-lg top-4 left-4">
        <div className="flex">
          <button 
            onClick={() => setMapType('map')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mapType === 'map' 
                ? 'text-white bg-blue-600 shadow-inner' 
                : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            Map
          </button>
          <button 
            onClick={() => setMapType('satellite')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mapType === 'satellite' 
                ? 'text-white bg-blue-600 shadow-inner' 
                : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Vehicle Controls at Bottom */}
    
    </div>
  );
}

export default App;
