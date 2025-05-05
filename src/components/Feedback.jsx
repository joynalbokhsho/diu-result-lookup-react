import React, { useState, useEffect } from 'react';
import { FaComment } from 'react-icons/fa';
import '../assets/styles.css'; // Make sure styles are imported

const Feedback = ({ isOpen, onClose }) => {
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  
  // Add body class to prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Prevent layout shift
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);
    
    try {
      const webhookUrl = "https://discord.com/api/webhooks/1369053072378167336/_yHWlBAQFEKxLTbePBLzIFj-5xw1IbIhkfHgPmzUO88Smf6SzyP_5piBifjcnFsnlbII";
      
      // Get current timestamp in Unix time (seconds)
      const now = Math.floor(Date.now() / 1000);
      
      // Create embed content
      const embed = {
        title: "📝 New User Feedback",
        color: 5793266, // Green-blue color
        fields: [
          {
            name: "User Name",
            value: feedbackName || "Not provided",
            inline: true
          },
          {
            name: "User Email",
            value: feedbackEmail || "Not provided",
            inline: true
          },
          {
            name: "Timestamp",
            value: `<t:${now}:R>`, // Discord relative timestamp format
            inline: false
          },
          {
            name: "Feedback Message",
            value: feedbackText || "No message provided",
            inline: false
          }
        ],
        timestamp: new Date().toISOString(), // ISO timestamp for embed footer
        footer: {
          text: "DIU RESULT LOOKUP FEEDBACK"
        }
      };
      
      // Construct payload
      const payload = {
        embeds: [embed]
      };
      
      // Send to Discord
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        // Reset form fields on successful submission
        setFeedbackName('');
        setFeedbackEmail('');
        setFeedbackText('');
        
        // Close modal after 3 seconds on success
        setTimeout(() => {
          onClose();
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setSubmitError(true);
      }
    } catch (err) {
      console.error("Failed to send feedback:", err);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop') && !submitting) {
      onClose();
    }
  };
  
  if (!isOpen) return null;

  // Calculate modal width based on screen size
  const getModalWidth = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 576) {
      return '95%'; // For mobile devices
    } else if (windowWidth < 992) {
      return '80%'; // For tablets
    } else {
      return '500px'; // For desktops
    }
  };

  const inputStyle = {
    width: '100%', 
    fontSize: '1rem',
    padding: '0.75rem',
    height: '45px',
    boxSizing: 'border-box',
    display: 'block',
    lineHeight: '1.5',
    color: '#212529',
    backgroundColor: '#fff',
    backgroundClip: 'padding-box',
    border: '1px solid #ced4da',
    borderRadius: '0.25rem',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
  };

  return (
    <>
      <div 
        className={`modal fade ${isOpen ? 'show feedback-modal-open' : ''}`}
        style={{ 
          display: 'block', 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1050,
          overflow: 'auto',
          transition: 'opacity 0.15s linear'
        }} 
        tabIndex="-1"
        aria-modal="true"
        role="dialog"
      >
        <div 
          className="modal-dialog modal-dialog-centered" 
          style={{ 
            maxWidth: getModalWidth(),
            width: getModalWidth(),
            margin: '1.75rem auto'
          }}
        >
          <div 
            className="modal-content shadow-lg" 
            style={{ 
              width: '100%',
              borderRadius: '8px',
              border: 'none',
              animation: isOpen ? 'modalFadeIn 0.3s' : 'none'
            }}
          >
            <div 
              className="modal-header bg-light" 
              style={{ 
                borderBottom: '1px solid #dee2e6', 
                padding: '1rem 1.5rem'
              }}
            >
              <h5 className="modal-title fw-bold">
                <FaComment className="me-2 text-primary" /> Share Your Feedback
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => !submitting && onClose()}
                disabled={submitting}
                aria-label="Close"
              ></button>
            </div>
            
            <div 
              className="modal-body" 
              style={{ 
                padding: '1.5rem',
                width: '100%'
              }}
            >
              {submitSuccess ? (
                <div className="alert alert-success d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>
                    Thank you for your feedback! We appreciate your input.
                  </div>
                </div>
              ) : submitError ? (
                <div className="alert alert-danger d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>
                    Sorry, there was a problem submitting your feedback. Please try again later.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} style={{ width: '100%' }}>
                  <div className="mb-3" style={{ width: '100%' }}>
                    <label htmlFor="feedbackName" className="form-label fw-semibold">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="feedbackName"
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      placeholder="Your name (optional)"
                      style={inputStyle}
                    />
                  </div>
                  <div className="mb-3" style={{ width: '100%', marginBottom: '1rem' }}>
                    <label htmlFor="feedbackEmail" className="form-label fw-semibold" style={{ marginBottom: '0.5rem', display: 'block' }}>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="feedbackEmail"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      placeholder="Your email (optional)"
                      style={{
                        ...inputStyle,
                        minWidth: '100%',
                        maxWidth: '100%',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none'
                      }}
                    />
                  </div>
                  <div className="mb-4" style={{ width: '100%' }}>
                    <label htmlFor="feedbackText" className="form-label fw-semibold">Your Feedback</label>
                    <textarea
                      className="form-control"
                      id="feedbackText"
                      rows="5"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Please share your thoughts, suggestions, or report issues..."
                      required
                      style={{ 
                        width: '100%', 
                        fontSize: '1rem',
                        padding: '0.75rem',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        minHeight: '120px'
                      }}
                    ></textarea>
                  </div>
                  <div className="d-grid" style={{ width: '100%' }}>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submitting}
                      style={{ 
                        position: 'relative',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        width: '100%'
                      }}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : 'Submit Feedback'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <div 
        className={`modal-backdrop fade ${isOpen ? 'show' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040,
          transition: 'opacity 0.15s linear'
        }}
        onClick={handleBackdropClick}
      ></div>
    </>
  );
};

export default Feedback;