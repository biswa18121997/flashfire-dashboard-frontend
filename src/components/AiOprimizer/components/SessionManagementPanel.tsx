// import { useState, useEffect } from 'react';
// import { Key, Activity } from 'lucide-react';

// interface SessionKey {
//   _id: string;
//   username: string;
//   sessionKey: string;
//   createdBy: string;
//   duration: number;
//   expiresAt: string;
//   isUsed: boolean;
//   isActive: boolean;
//   createdAt: string;
// }

// interface LoginEvent {
//   _id: string;
//   username: string;
//   ipAddress: string;
//   userAgent: string;
//   location: string;
//   createdAt: string;
//   lastActivity: string;
//   isActive: boolean;
// }

// export default function SessionManagementPanel({ token }: { token: string }) {
//   const [sessionKeys, setSessionKeys] = useState<SessionKey[]>([]);
//   const [loginHistory, setLoginHistory] = useState<LoginEvent[]>([]);
//   const [showGenerateSessionKey, setShowGenerateSessionKey] = useState(false);
//   const [sessionKeyForm, setSessionKeyForm] = useState({ username: '', duration: 24 });
//   const [loading, setLoading] = useState(true);

//   const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL || 'http://localhost:8001' : '');
//   const authFetch = (url: string, options: RequestInit = {}) => {
//     const headers: Record<string, string> = options.headers ? { ...options.headers as Record<string, string> } : {};
//     headers['Authorization'] = `Bearer ${token}`;
//     headers['Content-Type'] = 'application/json';
//     return fetch(`${API_BASE}${url}`, { ...options, headers });
//   };

//   const loadSessionKeys = async () => {
//     try {
//       const response = await authFetch('/api/sessions/session-keys');
//       if (response.ok) {
//         const data = await response.json();
//         setSessionKeys(data);
//       }
//     } catch (error) {
//       console.error('Failed to load session keys:', error);
//     }
//   };

//   const loadLoginHistory = async () => {
//     try {
//       const response = await authFetch('/api/sessions/active-sessions');
//       if (response.ok) {
//         const data = await response.json();
//         setLoginHistory(data);
//       }
//     } catch (error) {
//       console.error('Failed to load login history:', error);
//     }
//   };

//   useEffect(() => {
//     Promise.all([loadSessionKeys(), loadLoginHistory()]).finally(() => setLoading(false));
//   }, []);

//   const handleGenerateSessionKey = async () => {
//     try {
//       const response = await authFetch('/api/sessions/generate-session-key', {
//         method: 'POST',
//         body: JSON.stringify({
//           username: sessionKeyForm.username,
//           duration: sessionKeyForm.duration,
//           createdBy: 'admin'
//         })
//       });
//       if (response.ok) {
//         const data = await response.json();
//         alert(`Session key generated: ${data.sessionKey}\n\nThis 8-digit key is valid for ${sessionKeyForm.duration} hours.\n\nPlease provide this key to the intern for login.`);
//         setShowGenerateSessionKey(false);
//         setSessionKeyForm({ username: '', duration: 24 });
//         loadSessionKeys();
//       } else {
//         const error = await response.json();
//         alert(error.error || 'Failed to generate session key');
//       }
//     } catch (error) {
//       console.error('Failed to generate session key:', error);
//       alert('Failed to generate session key');
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8 text-gray-500">Loading session management...</div>;
//   }

//   return (
//     <div className="space-y-8 w-full h-full overflow-x-scroll">
//       <div className="flex items-center justify-between">
//         <h3 className="text-2xl font-bold text-gray-900">Session Management</h3>
//         <button
//           onClick={() => setShowGenerateSessionKey(true)}
//           className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
//         >
//           <Key className="h-4 w-4" />
//           <span>Generate Session Key</span>
//         </button>
//       </div>

//       {/* Active Sessions */}
//       <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
//         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//           <Activity className="h-5 w-5 text-blue-600" />
//           <span>Active Sessions</span>
//         </h4>
//         {loginHistory && loginHistory.length > 0 ? (
//           <div className="space-y-4">
//             {loginHistory.map((session) => (
//               <div key={session._id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-3 mb-2">
//                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                       <span className="font-semibold text-gray-900">{session.username}</span>
//                       <span className="text-sm text-gray-500">•</span>
//                       <span className="text-sm text-gray-500">{session.ipAddress}</span>
//                     </div>
//                     <div className="text-sm text-gray-600 space-y-1">
//                       <div>Location: {session.location}</div>
//                       <div>Last Activity: {new Date(session.lastActivity).toLocaleString()}</div>
//                       <div>Session Started: {new Date(session.createdAt).toLocaleString()}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//             <p>No active sessions found.</p>
//           </div>
//         )}
//       </div>

//       {/* Session Keys */}
//       <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
//         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//           <Key className="h-5 w-5 text-purple-600" />
//           <span>Generated Session Keys</span>
//         </h4>
//         {sessionKeys && sessionKeys.length > 0 ? (
//           <div className="space-y-4">
//             {sessionKeys.map((sessionKey) => (
//               <div key={sessionKey._id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-3 mb-2">
//                       <span className="font-semibold text-gray-900">{sessionKey.username}</span>
//                       <span className="text-sm text-gray-500">•</span>
//                       <span className="text-sm text-gray-500">{sessionKey.duration}h</span>
//                       <span className="text-sm text-gray-500">•</span>
//                       <span className={`text-sm px-2 py-1 rounded-full ${
//                         sessionKey.isUsed 
//                           ? 'bg-red-100 text-red-700' 
//                           : 'bg-green-100 text-green-700'
//                       }`}>
//                         {sessionKey.isUsed ? 'Used' : 'Active'}
//                       </span>
//                     </div>
//                     <div className="text-sm text-gray-600 space-y-1">
//                       <div>Session Key: <code className="bg-gray-200 px-2 py-1 rounded font-mono text-lg">{sessionKey.sessionKey}</code></div>
//                       <div>Expires: {new Date(sessionKey.expiresAt).toLocaleString()}</div>
//                       <div>Created: {new Date(sessionKey.createdAt).toLocaleString()}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             <Key className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//             <p>No session keys generated yet.</p>
//           </div>
//         )}
//       </div>

//       {/* Generate Session Key Modal */}
//       {showGenerateSessionKey && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all">
//             <div className="p-6 border-b border-gray-100">
//               <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
//                 <Key className="h-5 w-5" />
//                 <span>Generate Session Key</span>
//               </h3>
//             </div>
//             <form onSubmit={e => { e.preventDefault(); handleGenerateSessionKey(); }} className="p-6 space-y-6">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Username/Email</label>
//                   <input
//                     type="email"
//                     required
//                     value={sessionKeyForm.username}
//                     onChange={e => setSessionKeyForm({ ...sessionKeyForm, username: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="user@example.com"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
//                   <input
//                     type="number"
//                     min="1"
//                     max="168"
//                     required
//                     value={sessionKeyForm.duration}
//                     onChange={e => setSessionKeyForm({ ...sessionKeyForm, duration: parseInt(e.target.value) })}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="24"
//                   />
//                 </div>
//               </div>
//               <div className="flex space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowGenerateSessionKey(false)}
//                   className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
//                 >
//                   Generate Key
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useEffect, useRef } from 'react'
import { Key, Activity } from 'lucide-react'

interface SessionKey {
  _id: string
  username: string
  sessionKey: string
  createdBy: string
  duration: number
  expiresAt: string
  isUsed: boolean
  isActive: boolean
  createdAt: string
}

interface LoginEvent {
  _id: string
  username: string
  ipAddress: string
  userAgent: string
  location: string
  createdAt: string
  lastActivity: string
  isActive: boolean
}

export default function SessionManagementPanel({ token }: { token: string }) {
  const [sessionKeys, setSessionKeys] = useState<SessionKey[]>([])
  const [loginHistory, setLoginHistory] = useState<LoginEvent[]>([])
  const [showGenerateSessionKey, setShowGenerateSessionKey] = useState(false)
  const [sessionKeyForm, setSessionKeyForm] = useState({ username: '', duration: 24 })
  const [loading, setLoading] = useState(true)

  const modalRef = useRef<HTMLDivElement>(null)

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL || 'http://localhost:8001' : '')
  const authFetch = (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = options.headers
      ? { ...(options.headers as Record<string, string>) }
      : {}
    headers['Authorization'] = `Bearer ${token}`
    headers['Content-Type'] = 'application/json'
    return fetch(`${API_BASE}${url}`, { ...options, headers })
  }

  const loadSessionKeys = async () => {
    try {
      const response = await authFetch('/api/sessions/session-keys')
      if (response.ok) {
        const data = await response.json()
        setSessionKeys(data)
      }
    } catch (error) {
      console.error('Failed to load session keys:', error)
    }
  }

  const loadLoginHistory = async () => {
    try {
      const response = await authFetch('/api/sessions/active-sessions')
      if (response.ok) {
        const data = await response.json()
        setLoginHistory(data)
      }
    } catch (error) {
      console.error('Failed to load login history:', error)
    }
  }

  useEffect(() => {
    Promise.all([loadSessionKeys(), loadLoginHistory()]).finally(() => setLoading(false))
  }, [])

  const handleGenerateSessionKey = async () => {
    try {
      const response = await authFetch('/api/sessions/generate-session-key', {
        method: 'POST',
        body: JSON.stringify({
          username: sessionKeyForm.username,
          duration: sessionKeyForm.duration,
          createdBy: 'admin',
        }),
      })
      if (response.ok) {
        const data = await response.json()
        alert(
          `Session key generated: ${data.sessionKey}\n\nThis 8-digit key is valid for ${sessionKeyForm.duration} hours.\n\nPlease provide this key to the intern for login.`
        )
        setShowGenerateSessionKey(false)
        setSessionKeyForm({ username: '', duration: 24 })
        loadSessionKeys()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to generate session key')
      }
    } catch (error) {
      console.error('Failed to generate session key:', error)
      alert('Failed to generate session key')
    }
  }

  // Close modal when clicking outside or pressing Esc
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowGenerateSessionKey(false)
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowGenerateSessionKey(false)
    }

    if (showGenerateSessionKey) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEsc)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [showGenerateSessionKey])

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading session management...</div>
  }

  return (
    <div className="w-full  h-screen overflow-y-auto overflow-x-hidden p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Session Management</h3>
        <button
          onClick={() => setShowGenerateSessionKey(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <Key className="h-4 w-4" />
          <span>Generate Session Key</span>
        </button>
      </div>

      {/* Active Sessions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Active Sessions</span>
        </h4>
        {loginHistory && loginHistory.length > 0 ? (
          <div className="space-y-4">
            {loginHistory.map((session) => (
              <div
                key={session._id}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-gray-900">{session.username}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{session.ipAddress}</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Location: {session.location}</div>
                      <div>
                        Last Activity: {new Date(session.lastActivity).toLocaleString()}
                      </div>
                      <div>Session Started: {new Date(session.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No active sessions found.</p>
          </div>
        )}
      </div>

      {/* Session Keys */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Key className="h-5 w-5 text-purple-600" />
          <span>Generated Session Keys</span>
        </h4>
        {sessionKeys && sessionKeys.length > 0 ? (
          <div className="space-y-4">
            {sessionKeys.map((sessionKey) => (
              <div
                key={sessionKey._id}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-gray-900">{sessionKey.username}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{sessionKey.duration}h</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          sessionKey.isUsed
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {sessionKey.isUsed ? 'Used' : 'Active'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        Session Key:{' '}
                        <code className="bg-gray-200 px-2 py-1 rounded font-mono text-lg">
                          {sessionKey.sessionKey}
                        </code>
                      </div>
                      <div>Expires: {new Date(sessionKey.expiresAt).toLocaleString()}</div>
                      <div>Created: {new Date(sessionKey.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Key className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No session keys generated yet.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showGenerateSessionKey && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Generate Session Key</span>
              </h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleGenerateSessionKey()
              }}
              className="p-6 space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username/Email
                  </label>
                  <input
                    type="email"
                    required
                    value={sessionKeyForm.username}
                    onChange={(e) =>
                      setSessionKeyForm({ ...sessionKeyForm, username: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    required
                    value={sessionKeyForm.duration}
                    onChange={(e) =>
                      setSessionKeyForm({ ...sessionKeyForm, duration: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="24"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGenerateSessionKey(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
