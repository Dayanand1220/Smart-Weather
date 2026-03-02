import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FiStar, FiTrash, FiCloud } from 'react-icons/fi'; // Using FiStar, FiTrash, FiCloud
import { BsStarFill } from 'react-icons/bs'; // Keep BsStarFill for filled star
import './FavoriteCities.css';

function FavoriteCities({ favorites, onSelectCity, onRemoveFavorite }) {
  if (!favorites || favorites.length === 0) {
    return null;
  }

  return (
    <Row className="justify-content-center mb-4">
      <Col md={10} lg={8}>
        <Card className="glassmorphism-card border-0 p-2">
          <Card.Body className="p-4">
            <h5 className="mb-3 d-flex align-items-center text-primary">
              <FiStar size={20} className="me-2 favorite-star-icon" />
              Favorite Cities
            </h5>
            
            <Row className="g-3">
              {favorites.map((favorite) => (
                <Col key={favorite.id} xs={6} sm={4} md={3}>
                  <Card 
                    className="favorite-card h-100 text-center border"
                    onClick={() => onSelectCity(favorite.cityName)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body className="p-3 position-relative">
                      <FiCloud size={30} className="favorite-city-icon mb-2" />
                      <h6 className="mb-0 small text-primary">{favorite.cityName}</h6>
                      <Button
                        variant="link"
                        size="sm"
                        className="remove-favorite-btn position-absolute top-0 end-0 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFavorite(favorite.cityName);
                        }}
                      >
                        <FiTrash size={16} className="remove-icon" />
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default FavoriteCities;
