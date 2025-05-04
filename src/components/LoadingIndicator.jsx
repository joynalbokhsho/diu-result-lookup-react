import React, { useState, useEffect } from 'react';
import { FaUniversity, FaSearch, FaDatabase, FaServer, FaCheckCircle } from 'react-icons/fa';

const LoadingIndicator = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Array of loading messages to rotate through
  const loadingMessages = [
    "Fetching results from university database...",
    "Connecting to DIU academic records...",
    "Retrieving your semester grades...",
    "Processing academic information...",
    "Calculating GPA and CGPA...",
    "Formatting result data for display...",
    "Almost there, finalizing your results...",
    "Preparing your academic record..."
  ];
  
  // Array of helpful tips/facts to show below the main loading message
  const loadingTips = [
    "This may take a few moments.",
    "Results are fetched directly from the university database for accuracy.",
    "Your academic record is being compiled securely.",
    "We're retrieving data from multiple university systems.",
    "Your patience is appreciated while we gather complete information.",
    "Ensuring all course results are included in your report.",
    "Did you know? You can print your results directly from this page.",
    "Double-checking all information for accuracy."
  ];
  
  // Change message every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loadingMessages.length]); // Added loadingMessages.length as a dependency
  
  return (
    <div className="text-center my-5 py-5">
      <div className="loading-animation">
        <div className="spinner"></div>
      </div>
      <div className="loading-icon my-3">
        {/* Show different icons based on the current message */}
        {messageIndex % 5 === 0 && <FaUniversity size={30} color="#006A4E" />}
        {messageIndex % 5 === 1 && <FaSearch size={30} color="#006A4E" />}
        {messageIndex % 5 === 2 && <FaDatabase size={30} color="#006A4E" />}
        {messageIndex % 5 === 3 && <FaServer size={30} color="#006A4E" />}
        {messageIndex % 5 === 4 && <FaCheckCircle size={30} color="#006A4E" />}
      </div>
      <p className="loading-text">{loadingMessages[messageIndex]}</p>
      <p className="text-muted small">{loadingTips[messageIndex]}</p>
      {/* Progress indication for longer waits */}
      <div className="mt-4">
        <div className="progress" style={{ height: '4px', maxWidth: '300px', margin: '0 auto' }}>
          <div 
            className="progress-bar bg-success" 
            role="progressbar" 
            style={{ width: `${Math.min(100, (messageIndex + 1) * 12.5)}%` }}
            aria-valuenow={Math.min(100, (messageIndex + 1) * 12.5)} 
            aria-valuemin="0" 
            aria-valuemax="100">
          </div>
        </div>
        <p className="mt-2 text-muted" style={{ fontSize: '0.8rem' }}>
          {messageIndex < loadingMessages.length - 1 ? 'Still working...' : 'Almost complete!'}
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;