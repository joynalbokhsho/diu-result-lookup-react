import React, { useState, useEffect } from 'react';
import { FaComment } from 'react-icons/fa';

// Completely rewritten Feedback component with direct styling
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
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    
    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
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
      
      const embed = {
        title: "📝 New User Feedback",
        color: 5793266,
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
            value: `<t:${now}:R>`,
            inline: false
          },
          {
            name: "Feedback Message",
            value: feedbackText || "No message provided",
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "DIU RESULT LOOKUP FEEDBACK"
        }
      };
      
      const payload = { embeds: [embed] };
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
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
  
  if (!isOpen) return null;

  // Styles as JavaScript objects
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1050,
    padding: '20px'
  };
  
  // Get appropriate modal width based on screen size
  const getModalWidth = () => {
    const width = window.innerWidth;
    return width < 576 ? '95%' : width < 992 ? '80%' : '500px';
  };
  
  const modalContentStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: getModalWidth(),
    position: 'relative',
    overflow: 'hidden'
  };
  
  const modalHeaderStyle = {
    backgroundColor: '#f8f9fa',
    padding: '15px 20px',
    borderBottom: '1px solid #dee2e6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };
  
  const modalTitleStyle = {
    margin: 0,
    fontWeight: 600,
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center'
  };
  
  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
    color: '#666',
    outline: 'none'
  };
  
  const modalBodyStyle = {
    padding: '20px'
  };
  
  const formStyle = {
    width: '100%'
  };
  
  const formGroupStyle = {
    marginBottom: '20px'
  };
  
  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    fontSize: '16px'
  };
  
  const inputStyle = {
    width: '100%',
    height: '48px',
    padding: '10px 15px',
    fontSize: '16px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    boxSizing: 'border-box',
    display: 'block'
  };
  
  const textareaStyle = {
    ...inputStyle,
    height: 'auto',
    minHeight: '120px',
    resize: 'vertical'
  };
  
  const buttonStyle = {
    width: '100%',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 500,
    color: '#fff',
    backgroundColor: '#006A4E',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'block'
  };
  
  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: 0.65,
    cursor: 'not-allowed'
  };
  
  const alertSuccessStyle = {
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '4px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderColor: '#c3e6cb'
  };
  
  const alertErrorStyle = {
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '4px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderColor: '#f5c6cb'
  };

  return (
    <div style={modalOverlayStyle} onClick={(e) => {
      // Close when clicking outside the modal
      if (e.target === e.currentTarget && !submitting) onClose();
    }}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>
            <FaComment style={{ marginRight: '8px', color: '#006A4E' }} /> 
            Share Your Feedback
          </h3>
          <button 
            style={closeButtonStyle} 
            onClick={() => !submitting && onClose()} 
            disabled={submitting}
          >
            ×
          </button>
        </div>
        
        <div style={modalBodyStyle}>
          {submitSuccess ? (
            <div style={alertSuccessStyle}>
              Thank you for your feedback! We appreciate your input.
            </div>
          ) : submitError ? (
            <div style={alertErrorStyle}>
              Sorry, there was a problem submitting your feedback. Please try again later.
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} style={formStyle}>
              <div style={formGroupStyle}>
                <label htmlFor="feedbackName" style={labelStyle}>Name</label>
                <input
                  type="text"
                  id="feedbackName"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="Your name (optional)"
                  style={inputStyle}
                />
              </div>
              
              <div style={formGroupStyle}>
                <label htmlFor="feedbackEmail" style={labelStyle}>Email</label>
                <input
                  type="email"
                  id="feedbackEmail"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder="Your email (optional)"
                  style={inputStyle}
                />
              </div>
              
              <div style={formGroupStyle}>
                <label htmlFor="feedbackText" style={labelStyle}>Your Feedback</label>
                <textarea
                  id="feedbackText"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Please share your thoughts, suggestions, or report issues..."
                  required
                  style={textareaStyle}
                  rows="5"
                />
              </div>
              
              <button 
                type="submit" 
                style={submitting ? disabledButtonStyle : buttonStyle}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;