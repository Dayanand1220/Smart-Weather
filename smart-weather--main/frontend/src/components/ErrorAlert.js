import React, { useEffect } from 'react';
import { Alert, Row, Col } from 'react-bootstrap';

function ErrorAlert({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <Row className="justify-content-center mb-4">
      <Col md={8} lg={6}>
        <Alert variant="danger" dismissible onClose={onClose} className="shadow-sm">
          <Alert.Heading className="h6 mb-0">
            {message}
          </Alert.Heading>
        </Alert>
      </Col>
    </Row>
  );
}

export default ErrorAlert;
