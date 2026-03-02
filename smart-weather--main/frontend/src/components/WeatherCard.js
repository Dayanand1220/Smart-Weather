import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import {
  FiDroplet, FiWind, FiThermometer, FiSunrise, FiSunset, FiSun, FiCloud, FiCloudRain, FiCloudLightning, FiCloudSnow, FiMoon, FiCloudDrizzle
} from 'react-icons/fi';
import { BsStar, BsStarFill } from 'react-icons/bs';
import './WeatherCard.css';

const getWeatherIcon = (iconCode) => {
  const prefix = iconCode.substring(0, 2);
  const isDay = iconCode.includes('d');

  switch (prefix) {
    case '01': // clear sky
      return isDay ? <FiSun /> : <FiMoon />;
    case '02': // few clouds
      return isDay ? <FiCloud /> : <FiCloud />;
    case '03': // scattered clouds
    case '04': // broken clouds
      return <FiCloud />;
    case '09': // shower rain
    case '10': // rain
      return <FiCloudRain />;
    case '11': // thunderstorm
      return <FiCloudLightning />;
    case '13': // snow
      return <FiCloudSnow />;
    case '50': // mist
      return <FiCloudDrizzle />;
    default:
      return <FiSun />;
  }
};

function WeatherCard({ data, isFavorite, onToggleFavorite }) {
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getAQIVariant = (aqi) => {
    const variants = {
      1: 'success',
      2: 'info',
      3: 'warning',
      4: 'danger',
      5: 'danger'
    };
    return variants[aqi] || 'secondary';
  };

  const getAQILabel = (aqi) => {
    const labels = {
      1: 'Good',
      2: 'Fair',
      3: 'Moderate',
      4: 'Poor',
      5: 'Very Poor'
    };
    return labels[aqi] || 'N/A';
  };

  return (
    <Card className="weather-card glassmorphism-card border-0 p-2 h-100">
      <Card.Body className="p-4">
            {/* Header with City Name and Favorite Button */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="mb-1 fw-bold text-primary">{data.cityName}</h2>
                <p className="text-muted mb-0 text-capitalize">{data.description}</p>
              </div>
              <Button
                variant="link"
                className="favorite-btn p-0 text-decoration-none"
                onClick={() => onToggleFavorite(data.cityName)}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? (
                  <BsStarFill size={24} className="star-icon" />
                ) : (
                  <BsStar size={24} className="star-icon" />
                )}
              </Button>
            </div>

            {/* Temperature Display */}
            <div className="text-center mb-4 py-3">
              <div className="d-flex justify-content-center align-items-center flex-column">
                <div className="main-weather-icon mb-3">
                  {getWeatherIcon(data.icon)}
                </div>
                <h1 className="display-1 fw-bold mb-0 temp-display">
                  {data.temperature}°
                </h1>
                <p className="text-muted fs-5">Celsius</p>
              </div>
            </div>

            {/* Weather Details Grid */}
            <Row className="g-3">
              <Col xs={6} md={4}>
                <Card className="detail-card h-100 border">
                  <Card.Body className="text-center p-3">
                    <FiDroplet size={30} className="detail-icon mb-2" />
                    <p className="text-muted small mb-1">Humidity</p>
                    <h5 className="mb-0 fw-bold text-primary">{data.humidity}%</h5>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={6} md={4}>
                <Card className="detail-card h-100 border">
                  <Card.Body className="text-center p-3">
                    <FiWind size={30} className="detail-icon mb-2" />
                    <p className="text-muted small mb-1">Wind Speed</p>
                    <h5 className="mb-0 fw-bold text-primary">{data.windSpeed} m/s</h5>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={6} md={4}>
                <Card className="detail-card h-100 border">
                  <Card.Body className="text-center p-3">
                    <FiThermometer size={30} className="detail-icon mb-2" />
                    <p className="text-muted small mb-1">Air Quality</p>
                    {data.aqi ? (
                      <Badge bg={getAQIVariant(data.aqi)} className="fs-6 px-3 py-2">
                        {getAQILabel(data.aqi)}
                      </Badge>
                    ) : (
                      <h5 className="mb-0 fw-bold text-primary">N/A</h5>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={6} md={4}>
                <Card className="detail-card h-100 border">
                  <Card.Body className="text-center p-3">
                    <FiThermometer size={30} className="detail-icon mb-2" />
                    <p className="text-muted small mb-1">Pressure</p>
                    <h5 className="mb-0 fw-bold text-primary">{data.pressure} hPa</h5>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={6} md={4}>
                <Card className="detail-card h-100 border">
                  <Card.Body className="text-center p-3">
                    <FiSunrise size={30} className="detail-icon mb-2" />
                    <p className="text-muted small mb-1">Sunrise</p>
                    <h5 className="mb-0 fw-bold text-primary">{formatTime(data.sunrise)}</h5>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={6} md={4}>
                <Card className="detail-card h-100 border">
                  <Card.Body className="text-center p-3">
                    <FiSunset size={30} className="detail-icon mb-2" />
                    <p className="text-muted small mb-1">Sunset</p>
                    <h5 className="mb-0 fw-bold text-primary">{formatTime(data.sunset)}</h5>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
  );
}

export default WeatherCard;
