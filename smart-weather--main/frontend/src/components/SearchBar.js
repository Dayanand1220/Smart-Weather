import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, InputGroup, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { BsSearch, BsGeoAlt } from 'react-icons/bs';
import './SearchBar.css';
import axios from 'axios';

function SearchBar({ onSearch, loading }) {
  const [cityName, setCityName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (cityName.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await axios.get(`/api/autocomplete?q=${encodeURIComponent(cityName)}&limit=5`);
        setSuggestions(response.data.suggestions || []);
        setShowSuggestions(response.data.suggestions.length > 0);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setSuggestions([]);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [cityName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityName.trim()) {
      onSearch(cityName.trim());
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCityName(suggestion.city_name);
    setShowSuggestions(false);
    setSuggestions([]);
    onSearch(suggestion.city_name);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <Row className="justify-content-center mb-4">
      <Col md={10} lg={8}>
        <Card className="border-0 shadow-lg search-card">
          <Card.Body className="p-4">
            <h2 className="text-center mb-4">Discover Weather Worldwide</h2>
            <div ref={wrapperRef} style={{ position: 'relative' }}>
              <Form onSubmit={handleSubmit}>
                <InputGroup size="lg">
                  <Form.Control
                    type="text"
                    placeholder="Enter city name (e.g., London, New York, Tokyo)"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    className="border-end-0"
                    autoComplete="off"
                  />
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading || !cityName.trim()}
                    className="px-4"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Searching...
                      </>
                    ) : (
                      <>
                        <BsSearch className="me-2" />
                        Search
                      </>
                    )}
                  </Button>
                </InputGroup>
              </Form>

              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <Card className="autocomplete-dropdown border shadow-lg mt-2">
                  <ListGroup variant="flush">
                    {suggestions.map((suggestion, index) => (
                      <ListGroup.Item
                        key={`${suggestion.city_name}-${suggestion.country}-${index}`}
                        action
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`autocomplete-item ${index === selectedIndex ? 'active' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center">
                          <BsGeoAlt className="me-2 text-primary" size={18} />
                          <div>
                            <div className="fw-semibold">{suggestion.city_name}</div>
                            <small className="text-muted">
                              {suggestion.state ? `${suggestion.state}, ` : ''}{suggestion.country}
                            </small>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default SearchBar;
