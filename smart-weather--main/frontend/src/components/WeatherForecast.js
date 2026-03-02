import { Card, Row, Col } from 'react-bootstrap';
import { 
  WiDaySunny, 
  WiCloudy, 
  WiRain, 
  WiSnow, 
  WiThunderstorm,
  WiFog,
  WiHumidity,
  WiStrongWind
} from 'react-icons/wi';
import './WeatherForecast.css';

function WeatherForecast({ forecast }) {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': <WiDaySunny />,
      '01n': <WiDaySunny />,
      '02d': <WiCloudy />,
      '02n': <WiCloudy />,
      '03d': <WiCloudy />,
      '03n': <WiCloudy />,
      '04d': <WiCloudy />,
      '04n': <WiCloudy />,
      '09d': <WiRain />,
      '09n': <WiRain />,
      '10d': <WiRain />,
      '10n': <WiRain />,
      '11d': <WiThunderstorm />,
      '11n': <WiThunderstorm />,
      '13d': <WiSnow />,
      '13n': <WiSnow />,
      '50d': <WiFog />,
      '50n': <WiFog />
    };
    
    return iconMap[iconCode] || <WiDaySunny />;
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="forecast-card">
      <Card.Body>
        <h4 className="forecast-title mb-4">
          <WiDaySunny className="me-2" />
          5-Day Forecast
        </h4>
        
        <Row className="g-3">
          {forecast.map((day, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg className="forecast-day-col">
              <div className="forecast-day">
                <div className="forecast-day-name">{getDayName(day.date)}</div>
                <div className="forecast-date">{getFormattedDate(day.date)}</div>
                
                <div className="forecast-icon">
                  {getWeatherIcon(day.icon)}
                </div>
                
                <div className="forecast-temp">
                  <span className="temp-max">{Math.round(day.tempMax)}°</span>
                  <span className="temp-separator">/</span>
                  <span className="temp-min">{Math.round(day.tempMin)}°</span>
                </div>
                
                <div className="forecast-description">
                  {day.description}
                </div>
                
                <div className="forecast-details">
                  <div className="forecast-detail">
                    <WiHumidity />
                    <span>{day.humidity}%</span>
                  </div>
                  <div className="forecast-detail">
                    <WiStrongWind />
                    <span>{day.windSpeed} m/s</span>
                  </div>
                </div>
                
                {day.pop > 0 && (
                  <div className="forecast-rain">
                    <WiRain />
                    <span>{day.pop}% rain</span>
                  </div>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}

export default WeatherForecast;
