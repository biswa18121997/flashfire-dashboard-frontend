// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { UserContext } from '../state_management/UserContext.tsx'
// type Job = any; // Replace with your `Job` type

// interface UserJobsContextType {
//   userJobs: Job[];
//   setUserJobs: React.Dispatch<React.SetStateAction<Job[]>>;
//   loading: boolean;
// }

// export const UserJobsContext = createContext<UserJobsContextType | null>(null);

// export const UserJobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [userJobs, setUserJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//     const {userDetails, token, setData} = useContext(UserContext);
//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`http://localhost:8086/api/alljobs`, { 
//                         method: 'POST' ,
//                         headers : {'Content-Type' : 'application/json'},
//                         body : JSON.stringify({token, userDetails}) });
//       const data = await res.json();
//       setUserJobs(data?.allJobs || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <UserJobsContext.Provider value={{ userJobs, setUserJobs, loading }}>
//       {children}
//     </UserJobsContext.Provider>
//   );
// };





import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext.tsx';

type Job = any;

interface UserJobsContextType {
  userJobs: Job[];
  setUserJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  loading: boolean;
}

const UserJobsContext = createContext<UserJobsContextType | null>(null);

export const useUserJobs = () => {
  const context = useContext(UserJobsContext);
  if (!context) {
    throw new Error('useUserJobs must be used within a UserJobsProvider');
  }
  return context;
};

export const UserJobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { userDetails, token } = useContext(UserContext);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8086/api/alljobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userDetails })
      });
      const data = await res.json();
      setUserJobs(data?.allJobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserJobsContext.Provider value={{ userJobs, setUserJobs, loading }}>
      {children}
    </UserJobsContext.Provider>
  );
};
