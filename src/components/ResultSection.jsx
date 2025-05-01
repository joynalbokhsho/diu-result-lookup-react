import React from 'react';
import { FaPrint, FaSearch, FaStar, FaGraduationCap, FaUserGraduate, FaClipboardList } from 'react-icons/fa';

const ResultSection = ({ result, onPrint, onNewSearch }) => {
  // Function to determine motivational message based on GPA
  const getMotivationalMessage = (gpa) => {
    if (gpa >= 3.8) return "Outstanding performance! Keep up the excellent work!";
    if (gpa >= 3.5) return "Great job! Your hard work is paying off!";
    if (gpa >= 3.0) return "Good work! Keep pushing yourself to reach higher!";
    if (gpa >= 2.5) return "You're doing well! A little more effort can take you further.";
    return "Keep working hard. Persistence is key to academic success!";
  };
  
  // Function to get grade-specific motivational message
  const getGradeMessage = (grade) => {
    switch(grade) {
      case 'A+':
        return "Excellent mastery of the subject!";
      case 'A':
        return "Outstanding achievement!";
      case 'A-':
        return "Very impressive work!";
      case 'B+':
        return "Very good understanding!";
      case 'B':
        return "Good solid performance!";
      case 'B-':
        return "Good work with room to grow!";
      case 'C+':
        return "Fair understanding of concepts!";
      case 'C':
        return "Satisfactory performance!";
      case 'C-':
        return "Basic understanding achieved!";
      case 'D+':
        return "Passing, but needs improvement!";
      case 'D':
        return "Minimal passing performance!";
      default:
        return "Keep working to improve!";
    }
  };

  // Get current date for the print footer
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <section className="result-section">
      <div className="result-header">
        <h2><FaGraduationCap /> Academic Result</h2>
        <div className="semester-badge">
          {result.semester.name}
        </div>
      </div>
      
      <div className="row g-4 mb-4">
        {/* Student Information */}
        <div className="col-md-6">
          <div className="info-card">
            <div className="card-header">
              <FaUserGraduate /> Student Information
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="info-item">
                    <div className="info-label">Student ID</div>
                    <div className="info-value">{result.studentInfo.id}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-item">
                    <div className="info-label">Student Name</div>
                    <div className="info-value">{result.studentInfo.name}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-item">
                    <div className="info-label">Program</div>
                    <div className="info-value">{result.studentInfo.program}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-item">
                    <div className="info-label">Batch</div>
                    <div className="info-value">{result.studentInfo.batch}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Result Summary */}
        <div className="col-md-6">
          <div className="info-card">
            <div className="card-header">
              <FaClipboardList /> Result Summary
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="info-item">
                    <div className="info-label">Semester GPA</div>
                    <div className="info-value cgpa">{result.semester.gpa.toFixed(2)}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-item">
                    <div className="info-label">Overall CGPA</div>
                    <div className="info-value cgpa">{result.cgpa.toFixed(2)}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-item">
                    <div className="info-label">Total Credits</div>
                    <div className="info-value">
                      {result.courses.reduce((sum, course) => sum + course.credit, 0)}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-item">
                    <div className="info-label">Courses</div>
                    <div className="info-value">{result.courses.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Results Table */}
      <div className="result-table-card mb-4">
        <div className="card-header">
          <FaClipboardList /> Course Results
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Credit</th>
                  <th>Grade Point</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {result.courses.map((course, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{course.code}</td>
                      <td>
                        {course.title}
                        <div className="course-motivation">{getGradeMessage(course.grade)}</div>
                      </td>
                      <td>{course.credit.toFixed(1)}</td>
                      <td>{course.gradePoint.toFixed(2)}</td>
                      <td>{course.grade}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Motivational Message */}
      <div className="motivational-container">
        <p className="motivational-message-overall">
          <FaStar style={{ color: '#ffc107' }} />
          {getMotivationalMessage(result.semester.gpa)}
        </p>
      </div>
      
      {/* Print-only footer */}
      <div className="print-footer d-none">
        <p>Generated on {currentDate}</p>
        <p>© {new Date().getFullYear()} DIU Result Lookup. All Rights Reserved.</p>
        <p>This is an unofficial document and is not affiliated with Daffodil International University.</p>
      </div>
      
      {/* Action Buttons */}
      <div className="result-actions">
        <button 
          className="btn btn-success" 
          onClick={onPrint}
        >
          <FaPrint className="me-2" /> Print Result
        </button>
        
        <button 
          className="btn btn-secondary" 
          onClick={onNewSearch}
        >
          <FaSearch className="me-2" /> New Search
        </button>
      </div>
    </section>
  );
};

export default ResultSection;