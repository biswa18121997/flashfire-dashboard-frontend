// import React, { useState, useEffect, useContext } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// // import Navigation from './components/Navigation';
// // import Dashboard from './components/Dashboard';
// // import JobTracker from './components/JobTracker';
// // import ResumeOptimizer from './components/ResumeOptimizer';
// import Login from './components/Login';
// import Register from './components/Register';
// import MainContent from './components/MainContent';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { UserContext } from './state_management/UserContext.tsx';
// import { UserJobsProvider } from './state_management/UserJobs.tsx';
// import { UserContext } from './state_management/UserJobs.tsx';
// import { UserJobsContext } from './state_management/UserJobs.tsx';

// function App() {
  

//     // }
// let {userDetails, token} = useContext(UserContext);
// let { userJobs, setUserJobs, loading } = useContext(UserJobsContext);
//   useEffect(() => {
//     AOS.init({
//       duration: 800, // animation duration in ms
//       once: true,    // whether animation should happen only once
//     });
//   }, []);

//   return (
//     <UserJobsProvider>
//     <Router>
//       <Routes>
//       <Route path="/login" element={<Login />} />
    
//       <Route path="/registerIfAditJainWants" element={<Register />} />
//       <Route path='/' element={<MainContent to="/dashboard" replace />} />
//     </Routes>
      
      
//     </Router>
//     </UserJobsProvider>
//   )
// }

// export default App;



import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Login from './components/Login';
import Register from './components/Register';
import MainContent from './components/MainContent';

import { UserJobsProvider } from './state_management/UserJobs.tsx';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <UserJobsProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registerflashfire@123" element={<Register />} />
          <Route path="/" element={<MainContent />} />
        </Routes>
      </Router>
    </UserJobsProvider>
  );
}

export default App;
