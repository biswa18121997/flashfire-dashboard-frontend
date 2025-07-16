import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import Navigation from './components/Navigation';
// import Dashboard from './components/Dashboard';
// import JobTracker from './components/JobTracker';
// import ResumeOptimizer from './components/ResumeOptimizer';
import Login from './components/Login';
import Register from './components/Register';
import MainContent from './components/MainContent';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { UserContext } from './state_management/UserContext.tsx';
// import PDFUploader from './components/PDFUploader';
// import { useJobs } from './hooks/useJobs.ts';
// import { useOptimizedResumes } from './hooks/useOptimizedResumes.ts';
// import { ParsedResumeData } from './utils/pdfParser.ts';
// import { BaseResume } from './types';


function App() {
  
  
  // const {
  //   jobs,
  //   isLoading: jobsLoading,
  //   addJob,
  //   updateJob,
  //   deleteJob,
  //   updateJobStatus,
  // } = useJobs('demo-user');
  
  // const {
  //   optimizedResumes,
  //   isLoading: resumesLoading,
  //   addOptimizedResume,
  // } = useOptimizedResumes();

    // const savedResume = localStorage.getItem('base-resume-demo-user');
    // if (savedResume) {
    //   setBaseResume(JSON.parse(savedResume));
    // }
let {userDetails, token} = useContext(UserContext);
  useEffect(() => {
    AOS.init({
      duration: 800, // animation duration in ms
      once: true,    // whether animation should happen only once
    });
  }, []);

  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
    
      <Route path="/register" element={<Register />} />
      <Route path='/' element={<MainContent to="/dashboard" replace />} />
    </Routes>
      {/* {activeTab === 'login' && <Login activeTab={activeTab} onTabChange={setActiveTab}/>}
      {activeTab === 'register' && <Register />} */}
      
    </Router>
  )
}

export default App;
