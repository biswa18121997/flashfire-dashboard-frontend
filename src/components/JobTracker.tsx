// import React, { useState, useContext } from 'react';
// import { Plus, Search, Upload } from 'lucide-react';
// import { Job, JobStatus, BaseResume, OptimizedResume } from '../types';
// import JobForm from './JobForm';
// import JobCard from './JobCard';
// import { UserContext } from '../state_management/UserContext';

// interface JobTrackerProps {
//   jobs: Job;
//   // baseResume: BaseResume | null;
//   // optimizedResumes: OptimizedResume[];
//   onAddJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; duplicateCheck: DuplicateCheckResult };
//   onUpdateJob: (id: string, updates: Partial<Job>) => void;
//   onDeleteJob: (id: string) => void;
//   onUpdateJobStatus: (id: string, status: JobStatus) => void;
//   onAddOptimizedResume: (resume: OptimizedResume) => void;
//   // onShowPDFUploader: () => void;
// }

// const JobTracker = (
//   // jobs,
//   // baseResume,
//   // optimizedResumes,
//   // onAddJob,
//   // onUpdateJob,
//   // onDeleteJob,
//   // onUpdateJobStatus,
//   // onAddOptimizedResume,
//   // onShowPDFUploader,
// ) => {
//   const [showJobForm, setShowJobForm] = useState(false);
//   const [editingJob, setEditingJob] = useState<Job | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userJobs, setUserJobs] = useState({});
//   const context = useContext(UserContext);
//   const userDetails = context?.userDetails || {};
//   const token = context?.token || null;
//   // let navigate = useNavigate();
//   // let params = useParams();
  
//   async function GetUserDetail(){
//     let requestToServer = await fetch(`http://localhost:3000/api/alljobs`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ userDetails }),
//     });
//     let responseFromServer = await requestToServer.json();
//     if (responseFromServer.message == 'user found') {
//       setUserJobs(responseFromServer.data);
//       console.log('User details:', responseFromServer.data);
//     }
//   }
//   const statusColumns: { status: JobStatus; label: string; color: string }[] = [
//     { status: 'saved', label: 'Saved', color: 'bg-gray-50 border-gray-200' },
//     { status: 'applied', label: 'Applied', color: 'bg-blue-50 border-blue-200' },
//     { status: 'interviewing', label: 'Interviewing', color: 'bg-amber-50 border-amber-200' },
//     { status: 'offer', label: 'Offers', color: 'bg-green-50 border-green-200' },
//     { status: 'rejected', label: 'Rejected', color: 'bg-red-50 border-red-200' },
//   ];

//   // const filteredJobs = jobs.filter(job => 
//   //   job.status !== 'deleted' && (
//   //     job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //     job.company.toLowerCase().includes(searchQuery.toLowerCase())
//   //   )
//   // );

//   const handleAddJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
//     const result = onAddJob(jobData);
    
//     if (result.success) {
//       setShowJobForm(false);
//     }
    
//     return result;
//   };

//   const handleEditJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
//     if (editingJob) {
//       onUpdateJob(editingJob.id, jobData);
//       setEditingJob(null);
//     }
//     // return { success: true, duplicateCheck: { isDuplicate: false } };
//   };

//   const handleDragStart = (e: React.DragEvent, job: Job) => {
//     e.dataTransfer.setData('jobId', job.id);
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e: React.DragEvent, status: JobStatus) => {
//     e.preventDefault();
//     const jobId = e.dataTransfer.getData('jobId');
//     if (jobId) {
//       onUpdateJobStatus(jobId, status);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Tracker</h2>
//           <p className="text-gray-600">Track your job applications and manage your career pipeline</p>
//         </div>
//         <div className="mt-4 sm:mt-0 flex items-center space-x-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search jobs..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             />
//           </div>
          
//           <button
//             onClick={() => setShowJobForm(true)}
//             className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Add Job</span>
//           </button>
//         </div>
//       </div>

//       {/* Kanban Board */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//         {statusColumns.map(({ status, label, color }) => {
//           // const columnJobs = filteredJobs.filter(job => job.status === status);
          
//           return (
//             <div
//               key={status}
//               className={`rounded-lg border-2 border-dashed ${color} p-4 min-h-[600px]`}
//               onDragOver={handleDragOver}
//               onDrop={(e) => handleDrop(e, status)}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-semibold text-gray-900">{label}</h3>
//                 <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
//                   {columnJobs.length}
//                 </span>
//               </div>
              
//               <div className="space-y-3">
//                 {columnJobs.map((job) => (
//                   <JobCard
//                     key={job.id}
//                     job={job}
//                     onDragStart={handleDragStart}
//                     onEdit={() => setEditingJob(job)}
//                     onDelete={() => onDeleteJob(job.id)}
//                   />
//                 ))}
                
//                 {columnJobs.length === 0 && (
//                   <div className="text-center py-8 text-gray-500">
//                     <p className="text-sm">No jobs in this stage</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Job Form Modal */}
//       {(showJobForm || editingJob) && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <JobForm
//               job={editingJob}
//               onSubmit={editingJob ? handleEditJob : handleAddJob}
//               onCancel={() => {
//                 setShowJobForm(false);
//                 setEditingJob(null);
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobTracker;




















import React, { useState, useEffect, useContext } from 'react';
import { Plus, Search } from 'lucide-react';
import { Job, JobStatus } from '../types';
import JobForm from './JobForm';
import JobCard from './JobCard';
import { UserContext } from '../state_management/UserContext.tsx'
import { useNavigate } from 'react-router-dom';
import JobModal from './JobModal.tsx';

const JobTracker = () => {
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);;

  const {userDetails, token, setData} = useContext(UserContext);
  // const userDetails = context?.userDetails || {};
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const statusColumns: { status: JobStatus; label: string; color: string }[] = [
    { status: 'saved', label: 'Saved', color: 'bg-gray-50 border-gray-200' },
    { status: 'applied', label: 'Applied', color: 'bg-blue-50 border-blue-200' },
    { status: 'interviewing', label: 'Interviewing', color: 'bg-amber-50 border-amber-200' },
    { status: 'offer', label: 'Offers', color: 'bg-green-50 border-green-200' },
    { status: 'rejected', label: 'Rejected', color: 'bg-red-50 border-red-200' },
    { status: 'deleted', label: 'deleted', color: 'bg-red-500/50 border-red-100' }
  ];

useEffect(() => {
  setData({token, userDetails});
  (async () => {
    try {
      // const requestToServer = await fetch(`http://localhost:8086/api/alljobs`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({token, userDetails }),
      // });
      const requestToServer = await fetch(`${API_BASE_URL}/api/alljobs`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ token, userDetails }),
});

      
      const responseFromServer = await requestToServer.json();
      if (responseFromServer.message === 'all Jobs List') {
        setUserJobs(responseFromServer?.allJobs);
        console.log(userJobs);
      }
      else if(responseFromServer.message = 'invalid token please login again'){
        localStorage.clear();
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  })();
}, [userDetails]);

  // const handleAddJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
  //   const result = onAddJob(jobData);
  //   if (result.success) setShowJobForm(false);
  //   return result;
  // };

  const handleEditJob = async (jobData: Partial<Job>) => {
  if (!editingJob) return;

  try {
    const updatedJobDetails = {
      ...editingJob,
      ...jobData,
      userID: userDetails?.email,
    };

    // const response = await fetch(`http://localhost:8086/api/jobs`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     token,
    //     jobID: editingJob.jobID,
    //     userDetails,
    //     jobDetails: updatedJobDetails,
    //     action: 'update',
    //   }),
    // });
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token,
    jobID: editingJob.jobID,
    userDetails,
    jobDetails: updatedJobDetails,
    action: 'update',
  }),
});


    const result = await response.json();

    if (result.message === 'Jobs updated successfully') {
      setUserJobs(result.updatedJobs);
      console.log('Job updated:', result.updatedJobs);
    }
  } catch (err) {
    console.error('Failed to update job', err);
  } finally {
    setEditingJob(null);
    setShowJobForm(false);
  }
};



  const handleAddJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const jobDetails = {
        jobID : Date.now().toString(),
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        jobDescription: formData.jobDescription,
        joblink: formData.joblink,
        dateApplied: formData.dateApplied,
        currentStatus: formData.status,
        userID: userDetails.email, // Include user details
      };
      // const saveJobsToDb = await fetch(`http://localhost:8086/api/jobs`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({jobDetails,userDetails, token}),
      // });
      const saveJobsToDb = await fetch(`${API_BASE_URL}/api/jobs`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ jobDetails, userDetails, token }),
});

      const responseFromServer = await saveJobsToDb.json();
      console.log(responseFromServer);
      setUserJobs(responseFromServer.NewJobList);
      setShowJobForm(false);
      if (responseFromServer.message == 'Job Added Succesfully') {
        setJobsData(responseFromServer.NewJobList);
        return;
      }
      if (onSuccess) onSuccess();
      onCancel(); // close modal
    } catch (err) {
      console.log(err);
      setError("Failed to save job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }



  const handleDragStart = (e: React.DragEvent, job: Job) => {
    e.dataTransfer.setData('jobId', job.jobID);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('Drag over event triggered', e);
  };

  const onDeleteJob = async (jobID: string) => {
  try {
    // const response = await fetch(`http://localhost:8086/api/jobs`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ jobID, userDetails,token, action: 'delete' }),
    // });
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ jobID, userDetails, token, action: 'delete' }),
});

    const result = await response.json();
    if (result.message === 'Jobs updated successfully') {
      setUserJobs(result?.updatedJobs);
      console.log('Job deleted:', result?.updatedJobs);
    }
  } catch (error) {
    console.error('Error deleting job:', error);
  }
};
  const onUpdateJobStatus = async (jobID, status, userDetails)=> {
      try {
        // let reqToServer = await fetch(`http://localhost:8086/api/jobs`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({action: 'UpdateStatus', status, userDetails,token, jobID }),
        // });
        let reqToServer = await fetch(`${API_BASE_URL}/api/jobs`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ action: 'UpdateStatus', status, userDetails, token, jobID }),
});

        let resFromServer = await reqToServer.json();
        if (resFromServer.message === 'Jobs updated successfully') {
          setUserJobs(resFromServer?.updatedJobs);
          console.log('Job status updated:', resFromServer?.updatedJobs);
        }
        
      } catch (error) {
        console.log(error)
      }
    };


  const handleDrop = (e: React.DragEvent, status: JobStatus) => {
    e.preventDefault();
    console.log(status)
    const jobID = e.dataTransfer.getData('jobID');
    // const status = e.dataTransfer.getData('currentStatus');
    console.log(jobID);
    if (jobID) {
      onUpdateJobStatus(jobID, status, userDetails);
      
    }
  };

  //const openJobDetails = (e:React.ClickEvent, )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Tracker</h2>
          <p className="text-gray-600">Track your job applications and manage your career pipeline</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowJobForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 justify-evenly ">
  {/* Main Columns */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 flex-1">
    {statusColumns.map(({ status, label, color }) => {
      const columnJobs = userJobs?.filter(
        (job) =>
          job?.status === status &&
          (job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job?.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      return (
        <div
          key={status}
          className={`rounded-lg border-2 border-dashed ${color} p-4 min-h-[600px]`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{label}</h3>
            <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
              {columnJobs?.length}
            </span>
          </div>

          <div className="space-y-3">
            {userJobs?.filter((items)=>items.currentStatus == status).map((job) => (
              <JobCard 
                showJobModal={showJobModal}
                setShowJobModal={setShowJobModal}
                setSelectedJob={setSelectedJob}
                key={job.jobID}
                job={job}
                onDragStart={handleDragStart}
                onEdit={() => setEditingJob(job)}
                onDelete={() => onDeleteJob(job.jobID)}
              />
            ))}

            {columnJobs?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No jobs in this stage</p>
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>

  {/* Removed Column */}
  {/* <div className="w-[250px]  rounded-lg border-2 border-dashed bg-red-100 border-red-300 p-4 min-h-[600px]" onDragOver={handleDragOver}
  onDrop={(e) => handleDrop(e, 'deleted')}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-900">Deleted</h3>
      <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
        {
          userJobs?.filter(job => job.status === 'deleted').length
        }
      </span>
    </div>

    <div className="space-y-3">
      {userJobs?.filter(job => job.currentStatus === 'deleted').map(job => (
        <JobCard 
          showJobModal={showJobModal}
          setShowJobModal={setShowJobModal}
          setSelectedJob={setSelectedJob}
          key={job.jobID}
          job={job}
          onDragStart={handleDragStart}
          onEdit={() => setEditingJob(job)}
          onDelete={() => onDeleteJob(job.jobID)}
        />
      ))}

      {
        userJobs?.filter(job => job.currentStatus === 'deleted').length === 0 && (
          <div className="text-center py-8 text-gray-500" >
            <p className="text-sm">No jobs in this stage</p>
          </div>
        )
      }
    </div>
  </div> */}
</div>
        {showJobModal && <JobModal setShowJobModal={setShowJobModal} showJobModal={showJobModal} jobDetails={selectedJob}  />}
      {/* Job Form Modal */}
      {(showJobForm || editingJob) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <JobForm
              setUserJobs={setUserJobs}
              job={editingJob}
              
              onSubmit={editingJob ? handleEditJob : handleAddJob}
              onCancel={() => {
                setShowJobForm(false);
                setEditingJob(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTracker;
