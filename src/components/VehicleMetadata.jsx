import { useState, useEffect } from 'react';

function VehicleMetadata({ currentData, previousData, isPlaying }) {
  const [displaySpeed, setDisplaySpeed] = useState(0);

  useEffect(() => {
    if (currentData && previousData) {
      const distance = calculateDistance(
        previousData.latitude,
        previousData.longitude,
        currentData.latitude,
        currentData.longitude
      );
      
      const timeDiff = (new Date(currentData.timestamp) - new Date(previousData.timestamp)) / 1000;
      const speed = timeDiff > 0 ? (distance / timeDiff) * 3.6 : 0; // Convert m/s to km/h
      setDisplaySpeed(speed);
    }
  }, [currentData, previousData]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatCoordinate = (coord) => {
    return coord?.toFixed(6) || 'N/A';
  };

  if (!currentData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Data</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Data</h3>
      
      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Status</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${isPlaying ? 'text-green-600' : 'text-red-600'}`}>
              {isPlaying ? 'Moving' : 'Stopped'}
            </span>
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Latitude</p>
            <p className="text-sm font-mono font-medium text-gray-800">
              {formatCoordinate(currentData.latitude)}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Longitude</p>
            <p className="text-sm font-mono font-medium text-gray-800">
              {formatCoordinate(currentData.longitude)}
            </p>
          </div>
        </div>

        {/* Speed */}
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Speed</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-green-600">
              {displaySpeed.toFixed(1)}
            </span>
            <span className="text-sm text-gray-600">km/h</span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="p-3 bg-orange-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Timestamp</p>
          <p className="text-sm font-medium text-gray-800">
            {formatTimestamp(currentData.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VehicleMetadata;