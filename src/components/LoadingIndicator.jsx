import React from 'react';
import { FaUniversity } from 'react-icons/fa';

const LoadingIndicator = () => {
  return (
    <div className="text-center my-5 py-5">
      <div className="loading-animation">
        <div className="spinner"></div>
      </div>
      <div className="loading-icon my-3">
        <FaUniversity size={30} color="#006A4E" />
      </div>
      <p className="loading-text">Fetching results from university database...</p>
      <p className="text-muted small">This may take a few moments.</p>
    </div>
  );
};

export default LoadingIndicator;