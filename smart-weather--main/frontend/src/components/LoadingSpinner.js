import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="loading-text text-primary">Loading...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;

