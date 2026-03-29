import React from 'react';
// No direct import needed for static assets from public directory

interface MapSelectProps {
  zones: any[]; // Assuming zones is an array of some type
  onZoneSelect: (zone: any) => void;
}

const MapSelect: React.FC<MapSelectProps> = ({ zones, onZoneSelect }) => {
  const battleMapPath = '/Mapa_prototype.png'; // Reference from public directory

  return (
    <div className="map-select-container">
      <img src={battleMapPath} alt="Battle Map" className="battle-map-image" />
      <div className="zones-overlay">
        {zones.map((zone, index) => (
          <div
            key={index} // Using index as key, consider a more stable ID if available
            className="zone-item"
            onClick={() => onZoneSelect(zone)}
            style={{ /* Add styling based on zone data if needed */ }}
          >
            {/* Display zone information, if any */}
            <span>{`Zone ${index + 1}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapSelect; 