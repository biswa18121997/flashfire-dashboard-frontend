import React, { useEffect, useRef, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Briefcase, FileText, User, LogOut, ChevronDown, Edit2Icon, Building2, ChevronRight, Pencil, Save, X } from 'lucide-react';
import { UserContext } from '../state_management/UserContext.tsx';
import { useUserProfile } from "../state_management/ProfileContext";
import { useOperationsStore } from "../state_management/Operations.ts";
import { toastUtils, toastMessages } from '../utils/toast';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  setUserProfileFormVisibility : any //React.Dispatch<React.SetStateAction<boolean>>;
  
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, setUserProfileFormVisibility }) => {
  const navigate = useNavigate();
  let ctx = useContext(UserContext);
  let userDetails = ctx?.userDetails;
  const [user, setUser] = useState(userDetails?.name || '');
  const [profileDropDown, setProfileDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useUserProfile();
    const { role } = useOperationsStore();
  const hasProfile = !!userProfile?.email;
  
  // Dashboard Manager state
  const [dashboardManagerDropdownOpen, setDashboardManagerDropdownOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [dashboardManagerData, setDashboardManagerData] = useState({
    dashboardManager: userProfile?.dashboardManager || "",
    dashboardManagerContact: userProfile?.dashboardManagerContact || "",
  });
  const [tempData, setTempData] = useState({
    dashboardManager: "",
    dashboardManagerContact: "",
  });
  

  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Job Tracker', icon: Briefcase },
    { id: 'optimizer', label: 'Documents', icon: FileText },
  ];

  useEffect(() => {
    setUser(userDetails?.name || '');
  }, [userDetails]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropDown(false);
      }
    };

    if (profileDropDown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropDown]);

  const handleSwitchUser = () => {
      // localStorage.clear();
      localStorage.removeItem("userAuth");
      // setUser("");
      toastUtils.success("Switching to operations view...");
      navigate("/manage");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser('');
    toastUtils.success(toastMessages.logoutSuccess);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Dashboard Manager functions
  const handleEditName = () => {
    setTempData(prev => ({ ...prev, dashboardManager: dashboardManagerData.dashboardManager }));
    setEditingName(true);
  };

  const handleEditContact = () => {
    setTempData(prev => ({ ...prev, dashboardManagerContact: dashboardManagerData.dashboardManagerContact }));
    setEditingContact(true);
  };

  const handleSaveName = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/setprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ctx?.token}`,
        },
        body: JSON.stringify({
          dashboardManager: tempData.dashboardManager,
          dashboardManagerContact: dashboardManagerData.dashboardManagerContact,
          token: ctx?.token,
          userDetails: userDetails,
        }),
      });

      if (response.ok) {
        setDashboardManagerData(prev => ({ ...prev, dashboardManager: tempData.dashboardManager }));
        setEditingName(false);
        toastUtils.success("Manager name saved successfully");
        // Update the userProfile context
        if (userProfile) {
          userProfile.dashboardManager = tempData.dashboardManager;
        }
      } else {
        console.error("Failed to save manager name");
        toastUtils.error("Failed to save manager name");
      }
    } catch (error) {
      console.error("Error saving manager name:", error);
      toastUtils.error("Error saving manager name");
    }
  };

  const handleSaveContact = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/setprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ctx?.token}`,
        },
        body: JSON.stringify({
          dashboardManager: dashboardManagerData.dashboardManager,
          dashboardManagerContact: tempData.dashboardManagerContact,
          token: ctx?.token,
          userDetails: userDetails,
        }),
      });

      if (response.ok) {
        setDashboardManagerData(prev => ({ ...prev, dashboardManagerContact: tempData.dashboardManagerContact }));
        setEditingContact(false);
        toastUtils.success("Contact number saved successfully");
        // Update the userProfile context
        if (userProfile) {
          userProfile.dashboardManagerContact = tempData.dashboardManagerContact;
        }
      } else {
        console.error("Failed to save contact number");
        toastUtils.error("Failed to save contact number");
      }
    } catch (error) {
      console.error("Error saving contact number:", error);
      toastUtils.error("Error saving contact number");
    }
  };

  const handleCancelName = () => {
    setEditingName(false);
    setTempData(prev => ({ ...prev, dashboardManager: "" }));
  };

  const handleCancelContact = () => {
    setEditingContact(false);
    setTempData(prev => ({ ...prev, dashboardManagerContact: "" }));
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          
          {/* Enhanced Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              {/* <FileText className="w-7 h-7 text-white" /> */}
              <img src="./Logo.png" alt="" className='rounded-xl' />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                FLASHFIRE
              </h1>
              <p className="text-xs text-gray-500 font-medium -mt-1">Complete Workflow Optimization</p>
            </div>
          </div>
          
          {/* Enhanced Navigation Tabs */}
          <div className="flex items-center space-x-8">
            <div className="flex space-x-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <Link
                  key={id}
                  to="/"
                  onClick={() => onTabChange(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{label}</span>
                </Link>
              ))}
            </div>
            
           
            
            {/* Enhanced User Profile Section */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropDown(!profileDropDown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-700">{user}</p>
                    <p className="text-xs text-gray-500">Account</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileDropDown ? 'rotate-180' : ''}`} />
                </button>

                {/* Enhanced Dropdown Menu */}
                {profileDropDown && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 py-6 px-6 z-50">
                    {/* Arrow */}
                    <div className="absolute -top-2 right-8 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                    
                    {/* User Header */}
                    <Link to="/profile" target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center space-x-4 pb-6 border-b border-gray-100">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900">{user}</p>
                        <p className="text-sm text-gray-500 underline">View Profile</p>
                      </div>
                    </div>
                    </Link>
                    {/* User Details */}
                    {role == "operations" ? null : (
                      <div className="py-6 space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Email Address
                          </p>
                          <p className="text-sm text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                            {userDetails?.email}
                          </p>
                        </div>
                        {/* <div className='flex justify-between'> */}
                        {!hasProfile && (
                          <div
                            className="w-fit"
                            onClick={() =>
                              setUserProfileFormVisibility(
                                true
                              )
                            }
                          >
                            <div className="hover:cursor-pointer inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-50 to-yellow-200 text-amber-700 border-2 border-amber-200">
                              <Edit2Icon className="h-3 w-3 m-2" />{" "}
                              Edit/ Setup Profile
                            </div>
                          </div>
                        )}
                        {/* <Link to="/profile" target="_blank" rel="noopener noreferrer">
  <h1><User2Icon /></h1>
</Link> */}

                        {role == "operations" ? null : (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                              Current Plan
                            </p>
                            <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-2 border-amber-200">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                              {userDetails?.planType ||
                                "Free"}
                            </div>
                          </div>
                        )}

                        {/* Dashboard Manager Dropdown */}
                        {role == "operations" ? null : (
                          <div className="space-y-3">
                            {/* Header with dropdown toggle */}
                            <div 
                              className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                              onClick={() => setDashboardManagerDropdownOpen(!dashboardManagerDropdownOpen)}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Building2 className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900">
                                    Dashboard Manager
                                  </h3>
                                  <p className="text-xs text-gray-600">
                                    Manager details
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {dashboardManagerDropdownOpen ? (
                                  <ChevronDown className="w-4 h-4 text-gray-600" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-600" />
                                )}
                              </div>
                            </div>

                            {/* Collapsible content */}
                            {dashboardManagerDropdownOpen && (
                              <div className="border border-gray-200 rounded-lg bg-white p-3 space-y-3">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="block text-xs font-medium text-gray-700">
                                      Manager Name
                                    </label>
                                    {!editingName && (
                                      <button
                                        onClick={handleEditName}
                                        className="inline-flex items-center gap-1 bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700 rounded-md transition-colors"
                                      >
                                        <Pencil size={8} /> Edit
                                      </button>
                                    )}
                                  </div>
                                  {editingName ? (
                                    <div className="space-y-2">
                                      <input
                                        type="text"
                                        value={tempData.dashboardManager}
                                        onChange={(e) => setTempData(prev => ({
                                          ...prev,
                                          dashboardManager: e.target.value
                                        }))}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Enter manager name"
                                        autoFocus
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={handleSaveName}
                                          className="inline-flex items-center gap-1 bg-green-600 px-2 py-1 text-xs font-semibold text-white hover:bg-green-700 rounded-md transition-colors"
                                        >
                                          <Save size={8} /> Save
                                        </button>
                                        <button
                                          onClick={handleCancelName}
                                          className="inline-flex items-center gap-1 border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                        >
                                          <X size={8} /> Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-900 bg-gray-50 px-2 py-1 rounded-md">
                                      {dashboardManagerData.dashboardManager || (
                                        <span className="text-gray-400 italic">Not provided</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="block text-xs font-medium text-gray-700">
                                      Contact Number
                                    </label>
                                    {!editingContact && (
                                      <button
                                        onClick={handleEditContact}
                                        className="inline-flex items-center gap-1 bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700 rounded-md transition-colors"
                                      >
                                        <Pencil size={8} /> Edit
                                      </button>
                                    )}
                                  </div>
                                  {editingContact ? (
                                    <div className="space-y-2">
                                      <input
                                        type="text"
                                        value={tempData.dashboardManagerContact}
                                        onChange={(e) => setTempData(prev => ({
                                          ...prev,
                                          dashboardManagerContact: e.target.value
                                        }))}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Enter contact number"
                                        autoFocus
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={handleSaveContact}
                                          className="inline-flex items-center gap-1 bg-green-600 px-2 py-1 text-xs font-semibold text-white hover:bg-green-700 rounded-md transition-colors"
                                        >
                                          <Save size={8} /> Save
                                        </button>
                                        <button
                                          onClick={handleCancelContact}
                                          className="inline-flex items-center gap-1 border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                        >
                                          <X size={8} /> Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-900 bg-gray-50 px-2 py-1 rounded-md">
                                      {dashboardManagerData.dashboardManagerContact || (
                                        <span className="text-gray-400 italic">Not provided</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                                  <p className="text-xs text-green-700">
                                    Provide your assigned dashboard manager's contact information for support.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {role == "operations" ? (
                      <div className="pt-6 border-t border-gray-100 space-y-2">
                        <button
                          onClick={handleSwitchUser}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Switch Client</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-6 border-t border-gray-100 space-y-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all duration-200 shadow"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
     
    </nav>
  );
};

export default Navigation;



