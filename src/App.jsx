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
  const [serverOnline, setServerOnline] = useState(true); // Add server status state
  
  // Function to send notification to Discord webhook
  const sendDiscordNotification = async (studentInfo, semester, success, resultData = null, errorReason = null) => {
    const webhookUrl = "https://discord.com/api/webhooks/1368448135080316998/SQ5FhjCw_Beg5pEdqX_oY7okLyQup1kkx12fC6Y2S7ktZ7FJfd4LW1bQCBQ1bf6oTVQm";
    
    try {
      // Get current date and time
      const now = new Date().toLocaleString();
      
      // Create embed content
      const embed = {
        title: success ? "🔍 Result Lookup Success" : "❌ Result Lookup Failed",
        color: success ? 3066993 : 15158332, // Green for success, Red for failure
        fields: [
          {
            name: "Student ID",
            value: studentId,
            inline: true
          },
          {
            name: "Semester",
            value: semester || "Unknown",
            inline: true
          },
          {
            name: "Timestamp",
            value: now,
            inline: false
          }
        ],
        footer: {
          text: "DIU Result Lookup System"
        }
      };
      
      // Add error reason if lookup failed
      if (!success && errorReason) {
        embed.fields.push({
          name: "Failure Reason",
          value: errorReason,
          inline: false
        });
      }
      
      // Add student info details if available and successful lookup
      if (success && studentInfo) {
        embed.fields.push(
          {
            name: "Student Name",
            value: studentInfo.name || "Not Available",
            inline: true
          },
          {
            name: "Program",
            value: studentInfo.program || "Not Available",
            inline: true
          },
          {
            name: "Batch",
            value: studentInfo.batch || "Not Available",
            inline: true
          },
          {
            name: "Department",
            value: studentInfo.departmentName || "Not Available",
            inline: true
          }
        );
        
        // Add academic performance data if available
        if (resultData) {
          // Add SGPA and CGPA information
          embed.fields.push(
            {
              name: "SGPA",
              value: resultData.semester.gpa ? resultData.semester.gpa.toFixed(2) : "N/A",
              inline: true
            },
            {
              name: "CGPA",
              value: resultData.cgpa ? resultData.cgpa.toFixed(2) : "N/A",
              inline: true
            }
          );
          
          // Add course information if available
          if (resultData.courses && resultData.courses.length > 0) {
            // Create a formatted list of courses with their GPAs
            const coursesList = resultData.courses.map(course => 
              `${course.code}: ${course.title} (Grade: ${course.grade}, GPA: ${course.gradePoint.toFixed(2)})`
            ).join('\n');
            
            // If the course list is too long, truncate it
            const truncatedCoursesList = coursesList.length > 1000 
              ? coursesList.substring(0, 997) + "..." 
              : coursesList;
            
            embed.fields.push({
              name: "Course Results",
              value: truncatedCoursesList || "No courses found",
              inline: false
            });
          }
        }
      }
      
      // Construct payload
      const payload = {
        embeds: [embed]
      };
      
      // Send to Discord
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      console.log("Discord notification sent successfully");
    } catch (err) {
      // Don't let webhook errors affect the main app flow
      console.error("Failed to send Discord notification:", err);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    // Log search attempt to help with debugging
    console.log(`Searching for student: ${studentId}, semester: ${semesterId}`);
    
    try {
      // Validate inputs before making the API call
      if (!studentId.trim() || !semesterId.trim()) {
        throw new Error('Please provide both Student ID and Semester.');
      }

      // First fetch student info from the new API endpoint
      console.log('Fetching student info from API...');
      const studentInfoResponse = await fetch(`https://diuapi.joynalbokhsho.me/api/studentInfo?studentId=${studentId}`)
        .catch(fetchError => {
          console.error('Student info fetch error:', fetchError);
          // Don't throw an error here, we'll continue with the results fetch
          console.log('Continuing with results fetch despite student info error');
          return { ok: false };
        });
      
      // Initialize studentInfo with default values
      let studentInfo = {
        id: studentId,
        name: "Not Available",
        program: "Not Available",
        batch: "Not Available"
      };
      
      // If student info API call was successful, update the studentInfo object
      if (studentInfoResponse && studentInfoResponse.ok) {
        try {
          const studentData = await studentInfoResponse.json();
          console.log('Student info data received:', studentData);
          
          if (studentData) {
            studentInfo = {
              id: studentId,
              name: studentData.studentName || "Not Available",
              program: studentData.programName || "Not Available",
              batch: studentData.batchId || "Not Available",
              departmentName: studentData.deptShortName || "Not Available",
              facultyName: studentData.facultyName || "Not Available"
            };
          }
        } catch (jsonError) {
          console.error('Student info JSON parsing error:', jsonError);
          // Continue with default studentInfo values
        }
      }

      // Now fetch the actual results
      console.log('Fetching results data from API...');
      const response = await fetch(`https://diuapi.joynalbokhsho.me/api/semesterResult?semesterId=${semesterId}&studentId=${studentId}`)
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
      
      // Prepare result object
      const resultObject = {
        studentInfo: studentInfo,
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
      };
      
      // Set the result in state
      setResult(resultObject);
      
      // Send successful lookup notification to Discord
      await sendDiscordNotification(
        studentInfo, 
        `${firstItem.semesterName} ${firstItem.semesterYear}`,
        true,
        resultObject
      );
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
      
      // Send failed lookup notification to Discord
      await sendDiscordNotification(
        null,
        getSemesterName(semesterId),
        false,
        null,  // Fourth parameter is resultData (null for failed lookups)
        userMessage  // Fifth parameter is the error reason
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to get semester name from ID
  const getSemesterName = (id) => {
    const semesterMap = {
      "213": "Fall 2021",
      "221": "Spring 2022",
      "222": "Summer 2022",
      "223": "Fall 2022",
      "231": "Spring 2023",
      "232": "Summer 2023",
      "233": "Fall 2023",
      "241": "Spring 2024",
      "242": "Summer 2024",
      "243": "Fall 2024",
      "251": "Spring 2025"
    };
    return semesterMap[id] || id;
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
        serverOnline={serverOnline} 
        setServerOnline={setServerOnline} // Added setServerOnline prop here
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