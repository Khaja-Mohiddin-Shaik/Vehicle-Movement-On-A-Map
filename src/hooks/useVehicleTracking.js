import { useState, useEffect, useCallback } from 'react';

function useVehicleTracking() {
  const [routeData, setRouteData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [routePath, setRoutePath] = useState([]);

  // Load route data
  useEffect(() => {
    const loadRouteData = async () => {
      try {
        const response = await fetch('/dummy-route.json');
        const data = await response.json();
        setRouteData(data);
        
        // Initialize route path with first point
        if (data.length > 0) {
          setRoutePath([[data[0].latitude, data[0].longitude]]);
        }
      } catch (error) {
        console.error('Failed to load route data:', error);
      }
    };

    loadRouteData();
  }, []);

  // Vehicle movement simulation
  useEffect(() => {
    if (!isPlaying || currentIndex >= routeData.length - 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        
        // Update route path to include the new position
        if (nextIndex < routeData.length) {
          const newPoint = [routeData[nextIndex].latitude, routeData[nextIndex].longitude];
          setRoutePath(prevPath => [...prevPath, newPoint]);
        }
        
        // Stop at the end
        if (nextIndex >= routeData.length - 1) {
          setIsPlaying(false);
        }
        
        return nextIndex;
      });
    }, (2000 / speed)); // Base interval of 2 seconds, adjusted by speed

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, routeData.length, speed]);

  const togglePlay = useCallback(() => {
    if (currentIndex >= routeData.length - 1) {
      // Reset if at the end
      reset();
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [currentIndex, routeData.length]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
    if (routeData.length > 0) {
      setRoutePath([[routeData[0].latitude, routeData[0].longitude]]);
    }
  }, [routeData]);

  const currentPosition = routeData[currentIndex] 
    ? [routeData[currentIndex].latitude, routeData[currentIndex].longitude]
    : null;

  const currentData = routeData[currentIndex];
  const previousData = currentIndex > 0 ? routeData[currentIndex - 1] : null;

  const fullRoute = routeData.map(point => [point.latitude, point.longitude]);

  return {
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
  };
}

export default useVehicleTracking;