import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import JobTracker from './JobTracker';
import ResumeOptimizer from './ResumeOptimizer';
import { UserContext } from '../state_management/UserContext';
// import {BaseResume} from '../types/index'


export default function MainContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPDFUploader, setShowPDFUploader] = useState(false);
  const [baseResume, setBaseResume] = useState(null);
  const {userDetails, token} = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(()=>{
if(!token || token.length==0 ){
    navigate('/login');
  }
  })
  
  

  return (
    <div className="min-h-screen bg-gray-50">
        
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main>
          
          {activeTab === 'dashboard' && <Dashboard />}
          
          
          {activeTab === 'jobs' && (
            <JobTracker
              // jobs={jobs}
              // baseResume={baseResume}
              // optimizedResumes={optimizedResumes}
              // onAddJob={addJob}
              // onUpdateJob={updateJob}
              // onDeleteJob={deleteJob}
              // onUpdateJobStatus={updateJobStatus}
              // onAddOptimizedResume={addOptimizedResume}
              // onShowPDFUploader={() => setShowPDFUploader(true)}
            />
          )}

          {activeTab === 'optimizer' && (
            <ResumeOptimizer
              baseResume={baseResume}
              onShowPDFUploader={() => setShowPDFUploader(true)}
            />
          )}
        </main>

        {/* PDF Uploader Modal */}
        {showPDFUploader && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <PDFUploader
                onResumeUploaded={handleUploadPDFResume}
                onCancel={() => setShowPDFUploader(false)}
              />
            </div>
          </div>
        )}
      </div>
  )
}


