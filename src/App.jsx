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

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // Actual API call to the provided endpoint
      const response = await fetch(`https://diurecords.vercel.app/api/result?grecaptcha=&semesterId=${semesterId}&studentId=${studentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch results. The server might be down or experiencing issues.');
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('No results found for the given student ID and semester.');
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
          name: "Not Available",  // API doesn't provide student name
          program: "Not Available",  // API doesn't provide program
          batch: "Not Available"  // API doesn't provide batch
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
      setError(err.message || 'An error occurred while fetching results. The server might be down.');
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
      
      {loading && <LoadingIndicator />}
      {error && <ErrorContainer message={error} onRetry={handleRetry} />}
      {result && <ResultSection result={result} onPrint={handlePrint} onNewSearch={handleNewSearch} />}
      
      <FeaturesSection />
      <Footer />
    </div>
  );
}

export default App;