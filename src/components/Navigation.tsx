import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Briefcase, FileText, UsersRound, LogOut, MoveDown } from 'lucide-react';
import {UserContext} from '../state_management/UserContext.tsx';
import { useContext, useState } from 'react';


interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  let navigate = useNavigate();
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Job Tracker', icon: Briefcase },
    { id: 'optimizer', label: 'Resume Optimizer', icon: FileText },
  ];
  const { userDetails, token } = useContext(UserContext);
  let [user, setUser] = useState(userDetails.name);
  let [profileDropDown, setProfileDropDown] = useState(false);
  useEffect(() => {
    setUser(userDetails.name);
  },[userDetails]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  FLASHFIRE
                </h1>
                <p className="text-xs text-gray-500">Complete Workflow Optimization</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex space-x-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onTabChange(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            {/* <div className='flex flex-col items-center ml-32 p-4'>
              <UsersRound className='' />
              {user && <p >{user} </p>}
            </div> */}
            <div className="relative flex flex-col items-center ml-32 p-4">
  {/* clickable area */}
  <div onClick={() => setProfileDropDown(!profileDropDown)} className="cursor-pointer flex flex-col justify-center items-center">
    <UsersRound />
    {user && <p>{user}</p>}
  </div>

  {/* dropdown */}
  {profileDropDown && (
    <div className="absolute top-full  mt-2 bg-neutral-300 p-5 rounded shadow">
      <p className='w-fit text-nowrap'>User E-Mail -{userDetails.email} </p>
      {/* <p>Subscribed Plan -{userDetails.plan}</p> */}
    </div>
  )}
</div>
            <button onClick={() =>
  user
    ? (() => { localStorage.clear();setUser(''); navigate('/login'); })()
    : (()=>{navigate('/login');})()}
>
              {user && <LogOut className='' />}
               <p className='font-medium'>{user?'Logout':''} </p>
            </button>
          </div>
        </div>
      </div>
    </nav>
    
  );
};

export default Navigation;