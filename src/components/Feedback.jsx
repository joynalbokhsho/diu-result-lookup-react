import React, { useState, useEffect } from 'react';
import { FaComment, FaUser, FaEnvelope, FaPaperPlane, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Feedback = ({ isOpen, onClose }) => {
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [step, setStep] = useState(1);
  
  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFeedbackType('suggestion');
      setSubmitSuccess(false);
      setSubmitError(false);
    }
  }, [isOpen]);
  
  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    // Only submit if on step 3
    if (step !== 3) {
      return;
    }
    
    setSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);
    
    try {
      const webhookUrl = "https://discord.com/api/webhooks/1369053072378167336/_yHWlBAQFEKxLTbePBLzIFj-5xw1IbIhkfHgPmzUO88Smf6SzyP_5piBifjcnFsnlbII";
      const now = Math.floor(Date.now() / 1000);
      
      // Enhanced embed content with feedback type
      const embed = {
        title: `📝 New ${getFeedbackTypeLabel(feedbackType)}`,
        color: getFeedbackTypeColor(feedbackType),
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
            name: "Feedback Type",
            value: getFeedbackTypeLabel(feedbackType),
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
        setFeedbackType('suggestion');
        
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

  const getFeedbackTypeLabel = (type) => {
    switch(type) {
      case 'suggestion': return 'Suggestion';
      case 'issue': return 'Issue Report';
      case 'question': return 'Question';
      case 'appreciation': return 'Appreciation';
      default: return 'Feedback';
    }
  };
  
  const getFeedbackTypeColor = (type) => {
    switch(type) {
      case 'suggestion': return 5793266; // Green-blue
      case 'issue': return 15548997; // Red
      case 'question': return 16750848; // Orange
      case 'appreciation': return 5763719; // Purple
      default: return 5793266;
    }
  };
  
  const nextStep = () => {
    if (step === 1 && !feedbackType) return;
    if (step === 2 && !feedbackText.trim()) return;
    setStep(prev => Math.min(prev + 1, 3));
  };
  
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };
  
  // Handler for the final submit button click
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    handleFeedbackSubmit(e);
  };
  
  if (!isOpen) return null;

  // New design with styled components
  return (
    <div className="feedback-modal-overlay" onClick={(e) => {
      if (e.target.className === 'feedback-modal-overlay' && !submitting) onClose();
    }} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
      padding: '20px'
    }}>
      <div className="feedback-modal" style={{
        width: '100%',
        maxWidth: '550px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'modalFadeIn 0.3s ease',
        position: 'relative'
      }}>
        {/* Progress Bar */}
        <div style={{
          height: '4px',
          backgroundColor: '#e9ecef',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            backgroundColor: '#006A4E',
            width: submitSuccess ? '100%' : `${(step / 3) * 100}%`,
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
            color: '#006A4E',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FaComment style={{ marginRight: '12px' }} />
            {submitSuccess ? 'Feedback Sent!' : 'Share Your Feedback'}
          </h3>
          <button 
            onClick={() => !submitting && onClose()} 
            disabled={submitting}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              padding: '5px',
              color: '#6c757d'
            }}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Modal Body */}
        <div style={{
          padding: '24px',
          backgroundColor: 'white'
        }}>
          {submitSuccess ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px 0'
            }}>
              <div style={{
                backgroundColor: '#d1e7dd',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FaCheckCircle size={40} color="#0f5132" />
              </div>
              <h4 style={{ color: '#0f5132', marginBottom: '10px' }}>Thank You!</h4>
              <p style={{ color: '#4d4d4d', fontSize: '16px' }}>
                Your feedback has been successfully submitted. We appreciate your input!
              </p>
            </div>
          ) : submitError ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px 0'
            }}>
              <div style={{
                backgroundColor: '#f8d7da',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FaExclamationTriangle size={40} color="#842029" />
              </div>
              <h4 style={{ color: '#842029', marginBottom: '10px' }}>Something went wrong</h4>
              <p style={{ color: '#4d4d4d', fontSize: '16px' }}>
                We couldn't submit your feedback. Please try again later.
              </p>
              <button
                onClick={() => setSubmitError(false)}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  marginTop: '20px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '16px'
                }}
              >
                Try Again
              </button>
            </div>
          ) : (
            /* Changed this to just a regular div instead of a form to prevent auto-submission */
            <div>
              {/* Step 1: Choose feedback type */}
              {step === 1 && (
                <div style={{ 
                  animation: 'fadeIn 0.5s ease',
                  minHeight: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <h4 style={{ 
                    fontSize: '18px', 
                    marginBottom: '20px', 
                    textAlign: 'center',
                    color: '#333'
                  }}>
                    What type of feedback would you like to share?
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '16px'
                  }}>
                    {[
                      { id: 'suggestion', label: 'Suggestion', color: '#0dcaf0', icon: '💡' },
                      { id: 'issue', label: 'Report Issue', color: '#dc3545', icon: '🐞' },
                      { id: 'question', label: 'Question', color: '#fd7e14', icon: '❓' },
                      { id: 'appreciation', label: 'Appreciation', color: '#6f42c1', icon: '👍' }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setFeedbackType(type.id);
                          nextStep();
                        }}
                        style={{
                          background: feedbackType === type.id ? `${type.color}20` : 'white',
                          border: `2px solid ${feedbackType === type.id ? type.color : '#dee2e6'}`,
                          padding: '16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100px'
                        }}
                      >
                        <span style={{ fontSize: '24px', marginBottom: '8px' }}>{type.icon}</span>
                        <span style={{ 
                          fontWeight: '500',
                          color: feedbackType === type.id ? type.color : '#495057'
                        }}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Step 2: Write feedback message */}
              {step === 2 && (
                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '16px', color: '#333' }}>
                    Tell us your {getFeedbackTypeLabel(feedbackType).toLowerCase()}
                  </h4>
                  <div style={{ marginBottom: '20px' }}>
                    <textarea
                      id="feedbackText"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder={`Share your ${getFeedbackTypeLabel(feedbackType).toLowerCase()} with us...`}
                      required
                      style={{
                        width: '100%',
                        minHeight: '150px',
                        padding: '12px 16px',
                        fontSize: '16px',
                        border: '2px solid #ced4da',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#006A4E';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ced4da';
                      }}
                    ></textarea>
                  </div>
                </div>
              )}
              
              {/* Step 3: Contact information */}
              {step === 3 && (
                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '16px', color: '#333' }}>
                    Your contact information (optional)
                  </h4>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label 
                      htmlFor="feedbackName" 
                      style={{ 
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#495057'
                      }}
                    >
                      Name
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '2px solid #ced4da',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 12px',
                        backgroundColor: '#f8f9fa',
                        borderRight: '1px solid #ced4da',
                        color: '#6c757d'
                      }}>
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        id="feedbackName"
                        value={feedbackName}
                        onChange={(e) => setFeedbackName(e.target.value)}
                        placeholder="Your name"
                        style={{
                          flex: 1,
                          border: 'none',
                          padding: '12px 16px',
                          fontSize: '16px',
                          outline: 'none',
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label 
                      htmlFor="feedbackEmail" 
                      style={{ 
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#495057'
                      }}
                    >
                      Email
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '2px solid #ced4da',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 12px',
                        backgroundColor: '#f8f9fa',
                        borderRight: '1px solid #ced4da',
                        color: '#6c757d'
                      }}>
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        id="feedbackEmail"
                        value={feedbackEmail}
                        onChange={(e) => setFeedbackEmail(e.target.value)}
                        placeholder="Your email"
                        style={{
                          flex: 1,
                          border: 'none',
                          padding: '12px 16px',
                          fontSize: '16px',
                          outline: 'none',
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '20px',
                gap: '12px'
              }}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={submitting}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '2px solid #6c757d',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: '#6c757d',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Back
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#006A4E',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#006A4E',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {submitting ? (
                      <>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '3px solid rgba(255,255,255,0.3)',
                          borderTop: '3px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Submit Feedback
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style>
        {`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Feedback;