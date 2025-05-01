import React from 'react';
import { FaExclamationTriangle, FaServer, FaRedoAlt } from 'react-icons/fa';

const ErrorContainer = ({ message, onRetry }) => {
  // Check if the error is related to server/network issues
  const isServerError = message.toLowerCase().includes('network') || 
                        message.toLowerCase().includes('failed to fetch') || 
                        message.toLowerCase().includes('server') ||
                        message.toLowerCase().includes('timeout') ||
                        message.toLowerCase().includes('error');

  return (
    <div className="alert alert-danger my-4 p-4 d-flex align-items-start shadow-sm" role="alert">
      <div className="error-icon me-3">
        {isServerError ? <FaServer size={24} /> : <FaExclamationTriangle size={24} />}
      </div>
      <div className="error-content w-100">
        <h5 className="alert-heading mb-2">{isServerError ? "Server Issue" : "Error"}</h5>
        <p className="mb-3">{isServerError ? "The server is currently down or facing connectivity issues. Please try again later." : message}</p>
        
        {isServerError && (
          <div className="server-error-actions mt-2">
            <small className="d-block text-muted mb-3">
              This could be due to maintenance, high traffic, or temporary technical difficulties.
            </small>
            
            {onRetry && (
              <button 
                className="btn btn-sm btn-outline-danger" 
                onClick={onRetry}
              >
                <FaRedoAlt className="me-1" /> Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorContainer;