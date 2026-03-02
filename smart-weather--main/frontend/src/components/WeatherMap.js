import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './WeatherMap.css';

// Fix for default marker icon in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map view when coordinates change
function ChangeView({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

function WeatherMap({ weatherData }) {
  if (!weatherData || !weatherData.lat || !weatherData.lon) {
    return null;
  }

  const position = [weatherData.lat, weatherData.lon];
  const zoom = 10;

  return (
    <Card className="map-card border-0 shadow-lg h-100">
      <Card.Body className="p-0 h-100 d-flex flex-column">
        <div className="map-header p-3 border-bottom">
          <h5 className="mb-0">
            📍 Location Map - {weatherData.cityName}
          </h5>
        </div>
        <div className="map-container flex-grow-1">
          <MapContainer
            center={position}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <ChangeView center={position} zoom={zoom} />
            
            {/* OpenStreetMap Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Weather Marker */}
            <Marker position={position}>
              <Popup>
                <div className="map-popup">
                  <h6 className="mb-2">{weatherData.cityName}</h6>
                  <p className="mb-1">
                    <strong>Temperature:</strong> {weatherData.temperature}°C
                  </p>
                  <p className="mb-1">
                    <strong>Weather:</strong> {weatherData.description}
                  </p>
                  <p className="mb-0">
                    <strong>Humidity:</strong> {weatherData.humidity}%
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </Card.Body>
    </Card>
  );
}

export default WeatherMap;
