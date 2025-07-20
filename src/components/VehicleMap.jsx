import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom vehicle icon
const vehicleIcon = new L.DivIcon({
  html: `<div style="
    width: 16px; 
    height: 16px; 
    background-color: #22C55E; 
    border: 3px solid white; 
    border-radius: 50%; 
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  "></div>`,
  className: 'custom-vehicle-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && map) {
      map.setView(center, map.getZoom(), { animate: true, duration: 1 });
    }
  }, [center, map]);
  
  return null;
}

function VehicleMap({ currentPosition, routePath, fullRoute, isPlaying, mapType }) {
  const mapRef = useRef();
  const defaultCenter = [17.385044, 78.486671];
  const center = currentPosition || defaultCenter;

  // Define tile layer URLs
  const tileLayerUrl = mapType === 'satellite' 
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = mapType === 'satellite'
    ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="w-full h-full relative">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={true}
        className="w-full h-full"
        style={{ 
          height: '100vh', 
          width: '100vw',
          zIndex: 1
        }}
      >
        <TileLayer
          key={mapType} // Force re-render when map type changes
          url={tileLayerUrl}
          attribution={attribution}
          maxZoom={18}
        />
        
        <MapUpdater center={currentPosition} />
        
        {/* Full route (gray dashed line) */}
        {fullRoute && fullRoute.length > 1 && (
          <Polyline
            positions={fullRoute}
            pathOptions={{
              color: '#9CA3AF',
              weight: 3,
              opacity: 0.7,
              dashArray: '8, 8'
            }}
          />
        )}
        
        {/* Traveled route (green solid line) */}
        {routePath && routePath.length > 1 && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: '#22C55E',
              weight: 4,
              opacity: 1,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        )}
        
        {/* Vehicle marker */}
        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={vehicleIcon}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default VehicleMap;