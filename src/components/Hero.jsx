import React from 'react';
import { FaSearch, FaGraduationCap, FaExclamationTriangle } from 'react-icons/fa';
import ServerStatus from './ServerStatus';

const Hero = ({ studentId, setStudentId, semesterId, setSemesterId, onSubmit, serverOnline, setServerOnline }) => {
  // Set default semester to Spring 2025 if no semester is selected
  React.useEffect(() => {
    if (!semesterId) {
      setSemesterId('251');
    }
  }, [semesterId, setSemesterId]);

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
        </div>
        <div className="col-lg-6">
          <div className="card form-card">
            <div className="card-body">
              <h4 className="card-title">Search Your Result</h4>
              
              <div className="server-status-wrapper">
                <ServerStatus onStatusChange={setServerOnline} />
              </div>
              
              {!serverOnline && (
                <div className="alert alert-danger mb-3" role="alert">
                  <FaExclamationTriangle className="me-2" />
                  <strong>API server is currently offline.</strong> Search functionality is disabled until the server comes back online.
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
                      disabled={!serverOnline}
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
                      disabled={!serverOnline}
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
                  className={`btn ${serverOnline ? 'btn-primary' : 'btn-secondary'} w-100`}
                  disabled={!serverOnline}
                >
                  <FaSearch className="me-2" /> {serverOnline ? 'Find Results' : 'API Server Offline'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;