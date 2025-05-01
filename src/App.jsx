import React, { useState } from 'react';
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
  // Removed unused studentInfo state variable

  const fetchStudentInfo = async (id) => {
    try {
      console.log(`Fetching student info for ID: ${id}`);
      
      // Use our serverless proxy endpoint to avoid mixed content issues
      // This works on both HTTP and HTTPS
      const apiUrl = `/api/studentInfo?studentId=${id}`;
      
      console.log(`Making request to proxy API: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.warn('Student info API returned an error:', response.status);
        return null;
      }
      
      const data = await response.json();
      console.log('Student info response structure:', JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn('Error fetching student info:', err.message);
      return null;
    }
  };

  const extractStudentInfoFromResults = (resultData) => {
    if (!resultData || !Array.isArray(resultData) || resultData.length === 0) return null;
    
    // Get the first item for base information
    const firstItem = resultData[0];
    
    // Try to extract as much information as possible from the result data
    return {
      studentId: firstItem.studentId,
      studentName: firstItem.studentName || "Not Available",
      programName: firstItem.programName || "Not Available",
      progShortName: firstItem.progShortName || "",
      batchNo: firstItem.batchNo || firstItem.batchId || "Not Available",
      departmentName: firstItem.departmentName || "Not Available",
      facultyName: firstItem.facultyName || "Not Available"
    };
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // Validate inputs before making the API call
      if (!studentId.trim() || !semesterId.trim()) {
        throw new Error('Please provide both Student ID and Semester.');
      }

      // First fetch student information
      const studentInfoData = await fetchStudentInfo(studentId);
      
      // Continue with result fetching regardless of student info success
      // Actual API call to the provided endpoint
      const response = await fetch(`https://diurecords.vercel.app/api/result?grecaptcha=&semesterId=${semesterId}&studentId=${studentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch results. The server might be down or experiencing issues.');
      }
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // This specifically catches JSON parsing errors
        throw new Error('The server returned an invalid response. The DIU result server may be down.');
      }
      
      // Check for empty data more thoroughly
      if (!data || !Array.isArray(data) || data.length === 0) {
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
      
      setResult({
        studentInfo: {
          id: firstItem.studentId,
          // Use student info API data if available, otherwise fallback to extracting from results
          name: studentInfoData?.studentName || extractStudentInfoFromResults(data)?.studentName || "Not Available",
          program: studentInfoData ? 
            `${studentInfoData.programName || ""} ${studentInfoData.progShortName ? `(${studentInfoData.progShortName})` : ""}` : 
            `${extractStudentInfoFromResults(data)?.programName || ""} ${extractStudentInfoFromResults(data)?.progShortName ? `(${extractStudentInfoFromResults(data)?.progShortName})` : ""}` || "Not Available",
          batch: studentInfoData?.batchNo || extractStudentInfoFromResults(data)?.batchNo || "Not Available",
          department: studentInfoData?.departmentName || extractStudentInfoFromResults(data)?.departmentName || "Not Available",
          faculty: studentInfoData?.facultyName || extractStudentInfoFromResults(data)?.facultyName || "Not Available"
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
      // Create a user-friendly error message
      let userMessage = 'An error occurred while fetching results. The server might be down.';
      
      // Check for specific error types
      if (err.message.includes('JSON')) {
        userMessage = 'The DIU result server is currently unavailable or experiencing issues.';
      } else if (err.message.includes('No results found')) {
        userMessage = err.message;
      } else if (err.message) {
        userMessage = err.message;
      }
      
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
        {loading && <LoadingIndicator />}
        {error && <ErrorContainer message={error} onRetry={handleRetry} />}
        {result && <ResultSection result={result} onPrint={handlePrint} onNewSearch={handleNewSearch} />}
      </div>
      
      {!loading && !error && !result && (
        <FeaturesSection />
      )}
      <Footer />
    </div>
  );
}

export default App;