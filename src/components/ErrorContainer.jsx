import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorContainer = ({ message }) => {
  return (
    <div className="alert alert-danger my-4 p-4 d-flex align-items-center shadow-sm" role="alert">
      <div className="error-icon me-3">
        <FaExclamationTriangle size={24} />
      </div>
      <div className="error-content">
        <h5 className="alert-heading mb-2">Error</h5>
        <p className="mb-0">{message}</p>
      </div>
    </div>
  );
};

export default ErrorContainer;