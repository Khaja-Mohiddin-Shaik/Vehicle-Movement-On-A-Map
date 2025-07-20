import { useState, useEffect } from 'react';

function VehicleControls({ 
  isPlaying, 
  onTogglePlay, 
  onReset, 
  currentIndex, 
  totalPoints,
  speed,
  onSpeedChange 
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(totalPoints > 0 ? (currentIndex / (totalPoints - 1)) * 100 : 0);
  }, [currentIndex, totalPoints]);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 border-t border-gray-200 shadow-2xl bg-white/95 backdrop-blur-sm">
      <div className="max-w-4xl px-6 py-4 mx-auto">
        
        {/* Progress Info */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <span>Progress: {currentIndex + 1} / {totalPoints}</span>
          <span>{progress.toFixed(1)}% Complete</span>
        </div>

        {/* Progress Slider */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            readOnly
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${progress}%, #E5E7EB ${progress}%, #E5E7EB 100%)`
            }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          
          {/* Reset Button */}
          <button
            onClick={onReset}
            className="px-6 py-3 font-medium text-white transition-all duration-200 bg-gray-500 rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Reset
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="px-8 py-3 font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          {/* Speed Control */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Speed:</span>
            <select
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}

export default VehicleControls;