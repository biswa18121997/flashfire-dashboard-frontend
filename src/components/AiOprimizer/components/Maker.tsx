import React, { useState, useEffect, useRef } from 'react';
import { Plus, User, FileText, Edit, Trash2, Globe, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toastUtils } from '../../../utils/toast';

interface MakerProps {
  onEditResume?: (resume: any, client: any) => void;
}

interface Client {
  _id: string;
  name: string;
  email?: string;
  createdAt: string;
  resumes: Resume[];
}

interface Resume {
  _id: string;
  displayName: string;
  filename: string;
  isPublished: boolean;
  isBaseResume: boolean;
  createdAt: string;
}

const Maker: React.FC<MakerProps> = ({ onEditResume }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddResumeModal, setShowAddResumeModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newResumeName, setNewResumeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [authView, setAuthView] = useState<"login" | "admin" | "resume" | "maker">(
    "maker"
);
  
  // Track if we just created a new client to skip unnecessary refresh
  const skipNextRefresh = useRef(false);
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://resume-maker-backend-lf5z.onrender.com';

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Refresh selected client when it changes
  useEffect(() => {
    if (selectedClient) {
      // Skip refresh if we just created this client
      if (skipNextRefresh.current) {
        skipNextRefresh.current = false;
        return;
      }
      refreshSelectedClient();
    }
  }, [selectedClient?._id]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure all clients have a resumes array (for backward compatibility)
        const clientsWithResumes = data.map((client: any) => ({
          ...client,
          resumes: client.resumes || []
        }));
        setClients(clientsWithResumes);
        if (clientsWithResumes.length > 0 && !selectedClient) {
          setSelectedClient(clientsWithResumes[0]);
        }
      } else {
        toastUtils.error('Failed to fetch clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toastUtils.error('Error fetching clients');
    } finally {
      setLoading(false);
    }
  };

  const refreshSelectedClient = async () => {
    if (!selectedClient) return;
    
    try {
      // Use new optimized endpoint that gets resumes from ResumeIndex
      const response = await fetch(`${API_BASE_URL}/api/clients/${selectedClient._id}/resumes-list`);
      if (response.ok) {
        const data = await response.json();
        const updatedClient = {
          ...data.client,
          resumes: data.resumes || []
        };
        setClients(prev => prev.map(client => 
          client._id === selectedClient._id ? updatedClient : client
        ));
        setSelectedClient(updatedClient);
      } else {
        console.error('Failed to refresh client:', response.status, response.statusText);
        // Don't show error toast here as it's a background refresh
      }
    } catch (error) {
      console.error('Error refreshing client:', error);
      // Don't show error toast here as it's a background refresh
    }
  };

  const handleAddClient = async () => {
    if (!newClientName.trim()) {
      toastUtils.error('Client name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newClientName.trim(),
          email: newClientEmail.trim() || undefined,
        }),
      });

      if (response.ok) {
        const newClient = await response.json();
        // Ensure the new client has a resumes array
        const clientWithResumes = {
          ...newClient,
          resumes: newClient.resumes || []
        };
        setClients(prev => [...prev, clientWithResumes]);
        // Set flag to skip the automatic refresh since we already have fresh data
        skipNextRefresh.current = true;
        setSelectedClient(clientWithResumes);
        setNewClientName('');
        setNewClientEmail('');
        setShowAddClientModal(false);
        toastUtils.success('Client added successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toastUtils.error(errorData.error || 'Failed to add client');
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toastUtils.error('Error adding client');
    } finally {
      setLoading(false);
    }
  };

  const handleAddResume = async () => {
    if (!newResumeName.trim() || !selectedClient) {
      toastUtils.error('Resume name and client selection are required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/clients/${selectedClient._id}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: newResumeName.trim(),
          isBaseResume: selectedClient.resumes.length === 0, // First resume is base resume
        }),
      });

      if (response.ok) {
        // Resume created successfully
        // Refresh the client data to ensure we have the latest state
        await refreshSelectedClient();
        
        setNewResumeName('');
        setShowAddResumeModal(false);
        toastUtils.success('Resume added successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toastUtils.error(errorData.error || 'Failed to add resume');
      }
    } catch (error) {
      console.error('Error adding resume:', error);
      toastUtils.error('Error adding resume');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (resumeId: string, isPublished: boolean) => {
    if (!selectedClient) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/clients/${selectedClient._id}/resumes/${resumeId}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !isPublished,
        }),
      });

      if (response.ok) {
        setClients(prev => prev.map(client => 
          client._id === selectedClient._id 
            ? {
                ...client,
                resumes: client.resumes.map(resume =>
                  resume._id === resumeId
                    ? { ...resume, isPublished: !isPublished }
                    : isPublished ? resume : { ...resume, isPublished: false }
                )
              }
            : client
        ));
        setSelectedClient(prev => prev ? {
          ...prev,
          resumes: prev.resumes.map(resume =>
            resume._id === resumeId
              ? { ...resume, isPublished: !isPublished }
              : isPublished ? resume : { ...resume, isPublished: false }
          )
        } : null);
        toastUtils.success(`Resume ${!isPublished ? 'published' : 'unpublished'} successfully`);
      } else {
        toastUtils.error('Failed to update resume status');
      }
    } catch (error) {
      console.error('Error updating resume status:', error);
      toastUtils.error('Error updating resume status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!selectedClient) return;

    const resume = selectedClient.resumes.find(r => r._id === resumeId);
    if (resume?.isBaseResume) {
      toastUtils.error('Cannot delete base resume');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/clients/${selectedClient._id}/resumes/${resumeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClients(prev => prev.map(client => 
          client._id === selectedClient._id 
            ? { ...client, resumes: client.resumes.filter(r => r._id !== resumeId) }
            : client
        ));
        setSelectedClient(prev => prev ? {
          ...prev,
          resumes: prev.resumes.filter(r => r._id !== resumeId)
        } : null);
        toastUtils.success('Resume deleted successfully');
      } else {
        toastUtils.error('Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toastUtils.error('Error deleting resume');
    } finally {
      setLoading(false);
    }
  };

  const handleEditResume = (resume: Resume) => {
    // Call the parent component's onEditResume function if provided
    if (onEditResume && selectedClient) {
      onEditResume(resume, selectedClient);
    } else {
      // Fallback: open in new tab
      window.open(`/optimizer?resume=${resume.filename}&client=${encodeURIComponent(selectedClient?.name || '')}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Resume Maker - Client Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage clients and create resumes for them
              </p>
            </div>
            <div>
              <button
                onClick={() => setAuthView("admin") }
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Clients List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Clients</h2>
                <button
                  onClick={() => setShowAddClientModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Client</span>
                </button>
              </div>

              <div className="space-y-3">
                {clients.map((client) => (
                  <div
                    key={client._id}
                    onClick={() => setSelectedClient(client)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                      selectedClient?._id === client._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        {client.email && (
                          <p className="text-sm text-gray-500">{client.email}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          {client.resumes.length} resume{client.resumes.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {clients.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No clients yet</p>
                    <p className="text-sm">Add your first client to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Selected Client Details */}
          <div className="lg:col-span-2">
            {selectedClient ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{selectedClient.name}</h2>
                    {selectedClient.email && (
                      <p className="text-gray-600">{selectedClient.email}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowAddResumeModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Resume</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedClient.resumes.map((resume) => (
                    <div
                      key={resume._id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        resume.isPublished
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            resume.isPublished
                              ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                              : 'bg-gradient-to-br from-gray-400 to-gray-500'
                          }`}>
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{resume.displayName}</h3>
                              {resume.isBaseResume && (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  Base
                                </span>
                              )}
                              {resume.isPublished && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center space-x-1">
                                  <Globe className="w-3 h-3" />
                                  <span>Published</span>
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Created: {new Date(resume.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditResume(resume)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                            title="Edit Resume"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleTogglePublish(resume._id, resume.isPublished)}
                            className={`p-2 rounded-md transition-colors ${
                              resume.isPublished
                                ? 'text-orange-600 hover:bg-orange-100'
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={resume.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {resume.isPublished ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                          </button>

                          {!resume.isBaseResume && (
                            <button
                              onClick={() => handleDeleteResume(resume._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                              title="Delete Resume"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedClient.resumes.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
                      <p>Create the first resume for this client</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Client</h3>
                <p className="text-gray-600">Choose a client from the sidebar to view their resumes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Client</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client email"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddClientModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClient}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Resume Modal */}
      {showAddResumeModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Add Resume for {selectedClient?.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Display Name *
                </label>
                <input
                  type="text"
                  value={newResumeName}
                  onChange={(e) => setNewResumeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter resume display name"
                />
              </div>
              {selectedClient?.resumes.length === 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    This will be the base resume for {selectedClient?.name}. It cannot be deleted later.
                  </p>
                </div>
              )}
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddResumeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddResume}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Resume'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maker;
