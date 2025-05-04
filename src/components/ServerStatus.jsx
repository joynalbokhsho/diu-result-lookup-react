import React, { useState, useEffect } from 'react';
import { FaServer, FaExclamationTriangle } from 'react-icons/fa';

const ServerStatus = ({ onStatusChange }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  // Check server status on mount and periodically
  useEffect(() => {
    const checkServerStatus = async () => {
      setIsChecking(true);
      try {
        // Ping both APIs to check their status using actual endpoints
        // Using a sample student ID that likely exists in the system
        const sampleStudentId = '251-27-014';
        
        const [resultApiResponse, infoApiResponse] = await Promise.allSettled([
          // Check the results API with a HEAD request to avoid heavy data transfer
          fetch(`https://diuapi.joynalbokhsho.me/api/semesterResult?semesterId=251&studentId=${sampleStudentId}`, { 
            method: 'HEAD',
            timeout: 5000 
          }),
          // Check the student info API with a HEAD request
          fetch(`https://diuapi.joynalbokhsho.me/api/studentInfo?studentId=${sampleStudentId}`, { 
            method: 'HEAD',
            timeout: 5000 
          })
        ]);
        
        // If either API is responsive, consider the service online
        const resultApiOnline = resultApiResponse.status === 'fulfilled' && resultApiResponse.value.ok;
        const infoApiOnline = infoApiResponse.status === 'fulfilled' && infoApiResponse.value.ok;
        
        const serverOnline = resultApiOnline || infoApiOnline;
        console.log('API Status Check:', { resultApiOnline, infoApiOnline, serverOnline });
        
        setIsOnline(serverOnline);
        
        // Inform parent component about status
        if (onStatusChange) {
          onStatusChange(serverOnline);
        }
      } catch (error) {
        console.error('Server status check failed:', error);
        setIsOnline(false);
        if (onStatusChange) {
          onStatusChange(false);
        }
      } finally {
        setIsChecking(false);
      }
    };

    // Check immediately on mount
    checkServerStatus();
    
    // Then check every 30 seconds
    const intervalId = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, [onStatusChange]);

  if (isChecking) {
    return null; // Don't show anything while first check is in progress
  }

  return (
    <div className={`server-status ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? (
        <span className="status-badge online">
          <FaServer /> System Online
        </span>
      ) : (
        <span className="status-badge offline">
          <FaExclamationTriangle /> API Server Offline
        </span>
      )}
    </div>
  );
};

export default ServerStatus;