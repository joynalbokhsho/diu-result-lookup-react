import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
import ResultSection from './components/ResultSection';
import Footer from './components/Footer';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorContainer from './components/ErrorContainer';
import './assets/styles.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);

  const fetchStudentInfo = async (id) => {
    try {
      console.log(`Fetching student info for ID: ${id}`);
      const response = await fetch(`http://peoplepulse.diu.edu.bd:8189/result/studentInfo?studentId=${id}`);
      
      if (!response.ok) {
        console.warn('Student info API returned an error:', response.status);
        return null;
      }
      
      const data = await response.json();
      console.log('Student info received:', data);
      return data;
    } catch (err) {
      console.warn('Error fetching student info:', err.message);
      return null;
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setStudentInfo(null);
    
    // Log search attempt to help with debugging
    console.log(`Searching for student: ${studentId}, semester: ${semesterId}`);
    
    try {
      // Validate inputs before making the API call
      if (!studentId.trim() || !semesterId.trim()) {
        throw new Error('Please provide both Student ID and Semester.');
      }

      // First fetch student information
      const studentInfoData = await fetchStudentInfo(studentId);
      
      // Continue with result fetching regardless of student info success
      // Actual API call to the provided endpoint
      console.log('Fetching data from API...');
      const response = await fetch(`https://diurecords.vercel.app/api/result?grecaptcha=&semesterId=${semesterId}&studentId=${studentId}`)
        .catch(fetchError => {
          console.error('Fetch error:', fetchError);
          throw new Error('Network error. Please check your connection and try again.');
        });
      
      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        throw new Error(`Failed to fetch results (Status: ${response.status}). The server might be down or experiencing issues.`);
      }
      
      let data;
      try {
        console.log('Parsing JSON response...');
        data = await response.json();
        console.log('Data received:', data ? 'Data exists' : 'No data');
      } catch (jsonError) {
        // This specifically catches JSON parsing errors
        console.error('JSON parsing error:', jsonError);
        throw new Error('The server returned an invalid response. The DIU result server may be down.');
      }
      
      // Check for empty data more thoroughly
      if (!data) {
        console.error('Data is null or undefined');
        throw new Error(`No results found for Student ID: ${studentId} in the selected semester.`);
      }
      
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', typeof data);
        throw new Error(`Invalid response format. Please try again later.`);
      }
      
      if (data.length === 0) {
        console.error('Data array is empty');
        throw new Error(`No results found for Student ID: ${studentId} in the selected semester.`);
      }
      
      // Process the API response to match our result structure
      const firstItem = data[0];
      
      // Calculate GPA from the courses
      let totalPoints = 0;
      let totalCredits = 0;
      
      data.forEach(course => {
        totalPoints += course.pointEquivalent * course.totalCredit;
        totalCredits += course.totalCredit;
      });
      
      const semesterGpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
      
      // Store student info
      if (studentInfoData) {
        setStudentInfo(studentInfoData);
      }
      
      setResult({
        studentInfo: {
          id: firstItem.studentId,
          // Use student info API data if available, otherwise default values
          name: studentInfoData ? studentInfoData.studentName : "Not Available",
          program: studentInfoData ? `${studentInfoData.programName} (${studentInfoData.progShortName})` : "Not Available",
          batch: studentInfoData ? studentInfoData.batchNo : "Not Available",
          department: studentInfoData ? studentInfoData.departmentName : "Not Available",
          faculty: studentInfoData ? studentInfoData.facultyName : "Not Available"
        },
        semester: {
          id: firstItem.semesterId,
          name: `${firstItem.semesterName} ${firstItem.semesterYear}`,
          gpa: parseFloat(semesterGpa)
        },
        courses: data.map(course => ({
          code: course.customCourseId,
          title: course.courseTitle,
          credit: course.totalCredit,
          grade: course.gradeLetter,
          gradePoint: course.pointEquivalent
        })),
        cgpa: firstItem.cgpa
      });
    } catch (err) {
      console.error('Error caught in handleSearch:', err.message);
      
      // Create a user-friendly error message
      let userMessage = 'An error occurred while fetching results. The server might be down.';
      
      // Check for specific error types
      if (err.message.includes('JSON')) {
        userMessage = 'The DIU result server is currently unavailable or experiencing issues.';
      } else if (err.message.includes('No results found')) {
        userMessage = err.message;
      } else if (err.message.includes('Network error')) {
        userMessage = 'Cannot connect to the DIU server. Please check your internet connection.';
      } else if (err.message) {
        userMessage = err.message;
      }
      
      console.log('Setting error message:', userMessage);
      setError(userMessage);
      // Ensure result is null when there's an error
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setResult(null);
    setError('');
  };

  const handleRetry = () => {
    if (studentId && semesterId) {
      handleSearch();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Add error boundary effect
  useEffect(() => {
    // Global error handler for fetch and promise errors
    const handleGlobalError = (event) => {
      console.error('Global error caught:', event);
      if (!error) {
        setError('An unexpected error occurred. Please try again later.');
      }
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleGlobalError);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, [error]);

  return (
    <div className="app-container">
      <Navbar />
      <Hero 
        studentId={studentId}
        setStudentId={setStudentId}
        semesterId={semesterId}
        setSemesterId={setSemesterId}
        onSubmit={handleSearch}
      />
      
      <div className="container my-4">
        {/* Always show error if it exists, regardless of other states */}
        {error && <ErrorContainer message={error} onRetry={handleRetry} />}
        {loading && <LoadingIndicator />}
        {!error && result && <ResultSection result={result} onPrint={handlePrint} onNewSearch={handleNewSearch} />}
      </div>
      
      {/* Always show features section regardless of result state */}
      <FeaturesSection />
      
      <Footer />
    </div>
  );
}

export default App;