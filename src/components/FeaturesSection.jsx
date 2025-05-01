import React from 'react';
import { FaSearch, FaPrint, FaShieldAlt } from 'react-icons/fa';

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <h2 className="section-title">Key Features</h2>
      <div className="container">
        <div className="row g-4 justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="feature-card">
              <div className="feature-icon">
                <FaSearch />
              </div>
              <h4>Quick Search</h4>
              <p>Access your results instantly by entering your Student ID and selecting the semester.</p>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-4">
            <div className="feature-card">
              <div className="feature-icon">
                <FaPrint />
              </div>
              <h4>Easy Print</h4>
              <p>Print your academic results directly from the browser with proper formatting for physical copies.</p>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-4">
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h4>Secure Access</h4>
              <p>Your academic information is securely retrieved using the university's official API.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;