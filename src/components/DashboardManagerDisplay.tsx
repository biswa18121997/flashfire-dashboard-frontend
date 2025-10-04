import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { useUserProfile } from '../state_management/ProfileContext';
import { UserContext } from '../state_management/UserContext';

interface DashboardManager {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  profilePhoto: string;
}

const DashboardManagerDisplay: React.FC = () => {
  const { userProfile, updateProfile } = useUserProfile();
  const { userDetails } = useContext(UserContext);
  const [managerData, setManagerData] = useState<DashboardManager | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to assign a dashboard manager for testing
  const assignTestManager = async (managerName: string) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = userDetails?.token;
      const email = userDetails?.email;

      const response = await fetch(`${API_BASE_URL}/setprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          dashboardManager: managerName,
          email,
          token,
          userDetails,
        }),
      });

      if (response.ok) {
        updateProfile({ dashboardManager: managerName });
        alert(`Dashboard manager assigned: ${managerName}`);
      } else {
        alert('Failed to assign dashboard manager');
      }
    } catch (error) {
      console.error('Error assigning manager:', error);
      alert('Error assigning dashboard manager');
    }
  };

  // Fetch manager details when component mounts
  useEffect(() => {
    const fetchManagerDetails = async () => {
      const managerName = userProfile?.dashboardManager || userDetails?.dashboardManager;
      if (!managerName) return;

      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/dashboard-managers/${encodeURIComponent(managerName)}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setManagerData(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching manager details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerDetails();
  }, [userProfile?.dashboardManager, userDetails?.dashboardManager]);

  // Check both userProfile and userDetails for dashboardManager
  const dashboardManager = userProfile?.dashboardManager || userDetails?.dashboardManager;
  
  // Show fallback if no manager is assigned
  if (!dashboardManager) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20 hover:bg-white/90 transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
            <span className="text-gray-500 text-sm">?</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">
              No Manager Assigned
            </span>
            <span className="text-xs text-gray-500">
              Contact Support
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
            <div className="px-4 py-3">
              <h3 className="font-medium text-gray-900 mb-2">No Dashboard Manager Assigned</h3>
              <p className="text-sm text-gray-600 mb-3">
                Assign a test manager to see the dashboard manager feature:
              </p>
              <div className="space-y-2 mb-3">
                <button
                  onClick={() => assignTestManager('Sarah Ali')}
                  className="w-full text-left px-3 py-2 bg-orange-50 hover:bg-orange-100 rounded-lg text-sm border border-orange-200"
                >
                  📋 Assign Sarah Ali
                </button>
                <button
                  onClick={() => assignTestManager('Sonali')}
                  className="w-full text-left px-3 py-2 bg-orange-50 hover:bg-orange-100 rounded-lg text-sm border border-orange-200"
                >
                  📋 Assign Sonali
                </button>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-2">Or contact support:</p>
                <div className="text-xs text-gray-500">
                  <p>Email: support@flashfirehq.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>
    );
  }

  // Don't render if manager is assigned but data not loaded yet
  if (!managerData) {
    return (
      <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex flex-col">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-20 mb-1"></div>
          <div className="h-2 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Manager Display Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20 hover:bg-white/90 transition-all duration-200"
      >
        {/* Manager Photo */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <img
            src={managerData.profilePhoto}
            alt={managerData.fullName}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">${managerData.fullName.split(' ').map(n => n[0]).join('')}</div>`;
              }
            }}
          />
        </div>

        {/* Manager Name */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900">
            {managerData.fullName}
          </span>
          <span className="text-xs text-gray-500">
            Your Dashboard Manager
          </span>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
          {/* Manager Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={managerData.profilePhoto}
                  alt={managerData.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-full h-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">${managerData.fullName.split(' ').map(n => n[0]).join('')}</div>`;
                    }
                  }}
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">{managerData.fullName}</p>
                <p className="text-sm text-gray-500">Dashboard Manager</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="px-4 py-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-900">{managerData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Phone:</span>
                <span className="text-gray-900">{managerData.phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default DashboardManagerDisplay;
