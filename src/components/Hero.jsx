import React, { useState, useEffect } from 'react';
import { FaSearch, FaGraduationCap, FaExclamationTriangle, FaComment } from 'react-icons/fa';
import ServerStatus from './ServerStatus';
import Feedback from './Feedback';

const Hero = ({ studentId, setStudentId, semesterId, setSemesterId, onSubmit, serverOnline, setServerOnline, apiCheckComplete, onServerStatusChange }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Set default semester to Spring 2025 if no semester is selected
  useEffect(() => {
    if (!semesterId) {
      setSemesterId('251');
    }
  }, [semesterId, setSemesterId]);

  // Determine if form should be disabled
  const isFormDisabled = !apiCheckComplete || !serverOnline;

  return (
    <section className="hero-section">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h1 className="hero-title">
            <FaGraduationCap className="me-2" />
            DIU Result Lookup
          </h1>
          <p className="hero-subtitle">
            Get instant access to your academic results from Daffodil International University.
            Simply enter your Student ID and select a semester to view your grades. 
          </p>
          <button 
            className="btn btn-outline-secondary mt-2"
            onClick={() => setShowFeedbackModal(true)}
          >
            <FaComment className="me-2" /> Give Feedback
          </button>
        </div>
        <div className="col-lg-6">
          <div className="card form-card">
            <div className="card-body">
              <h4 className="card-title">Search Your Result</h4>
              
              <div className="server-status-wrapper">
                <ServerStatus onStatusChange={onServerStatusChange} />
              </div>
              
              {!apiCheckComplete && (
                <div className="alert alert-info mb-3" role="alert">
                  <FaExclamationTriangle className="me-2" />
                  <strong>Checking API status...</strong> Please wait while we verify the server connection.
                </div>
              )}
              
              {apiCheckComplete && !serverOnline && (
                <div className="alert alert-danger mb-3" role="alert">
                  <FaExclamationTriangle className="me-2" />
                  <strong>API server is currently offline.</strong> Search functionality is disabled because the University has changed the API from public to private. I'm sorry for the inconvenience — this was a decision made by the University.
                </div>
              )}
              
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="studentId" className="form-label">Student ID</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="studentId"
                      placeholder="Enter your student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      disabled={isFormDisabled}
                      required
                    />
                  </div>
                  <div className="form-text">Example: 251-12-345</div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="semesterId" className="form-label">Semester</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaGraduationCap />
                    </span>
                    <select
                      className="form-select"
                      id="semesterId"
                      value={semesterId}
                      onChange={(e) => setSemesterId(e.target.value)}
                      disabled={isFormDisabled}
                      required
                    >
                      <option value="" disabled>Select Semester</option>
                      <option value="213">Fall 2021</option>
                      <option value="221">Spring 2022</option>
                      <option value="222">Summer 2022</option>
                      <option value="223">Fall 2022</option>
                      <option value="231">Spring 2023</option>
                      <option value="232">Summer 2023</option>
                      <option value="233">Fall 2023</option>
                      <option value="241">Spring 2024</option>
                      <option value="242">Summer 2024</option>
                      <option value="243">Fall 2024</option>
                      <option value="251">Spring 2025</option>
                    </select>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className={`btn ${serverOnline && apiCheckComplete ? 'btn-primary' : 'btn-secondary'} w-100`}
                  disabled={isFormDisabled}
                >
                  <FaSearch className="me-2" /> 
                  {!apiCheckComplete ? 'Checking API Status...' : 
                   serverOnline ? 'Find Results' : 'API Server Offline'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <Feedback 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
    </section>
  );
};

export default Hero;