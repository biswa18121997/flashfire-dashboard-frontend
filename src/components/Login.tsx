// import { useState, useContext, type FormEvent } from "react"
// import { useNavigate } from "react-router-dom"
// import { Eye, EyeOff, Mail, Lock, CheckCircle, TrendingUp, Users, Award, Clock, ArrowRight } from "lucide-react"
// import { UserContext } from "../state_management/UserContext"
// import { useUserProfile } from "../state_management/ProfileContext"
// import { useOperationsStore } from "../state_management/Operations"
// import { toastUtils, toastMessages } from "../utils/toast"
// import { GoogleLogin } from "@react-oauth/google"

// interface LoginResponse {
//   message: string
//   token?: string
//   userDetails?: any
//   userProfile?: any
//   hasProfile?: boolean
//   user?: any
// }

// const statsData = [
//   {
//     value: "95%",
//     label: "Success Rate",
//     icon: <TrendingUp className="w-5 h-5" />,
//     color: "text-emerald-600",
//   },
//   {
//     value: "300K+",
//     label: "Applications Sent",
//     icon: <Users className="w-5 h-5" />,
//     color: "text-blue-600",
//   },
//   {
//     value: "97%",
//     label: "ATS Score",
//     icon: <Award className="w-5 h-5" />,
//     color: "text-orange-600",
//   },
//   {
//     value: "24/7",
//     label: "AI Working",
//     icon: <Clock className="w-5 h-5" />,
//     color: "text-purple-600",
//   },
// ]

// export default function Login() {
//   const [email, setEmail] = useState<string>("")
//   const [password, setPassword] = useState<string>("")
//   const [showPassword, setShowPassword] = useState<boolean>(false)
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [, setResponse] = useState<LoginResponse | null>(null)

//   const navigate = useNavigate()
//   const { setName, setEmailOperations, setRole, setManagedUsers } = useOperationsStore()
//   const userContext = useContext(UserContext)
//   const setData = userContext?.setData
//   const { setProfileFromApi } = useUserProfile()

//   const handleLogin = async (e: FormEvent) => {
//     e.preventDefault()
//     if (!email || !password) {
//       toastUtils.error("Email and Password are required!")
//       return
//     }

//     setIsLoading(true)
//     const loadingToast = toastUtils.loading(toastMessages.loggingIn)
//     try {
//       const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
//       const loginEndpoint = email.toLowerCase().includes("@flashfirehq") ? "/operations/login" : "/login"
//       const res = await fetch(`${API_BASE_URL}${loginEndpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       })
//       const data: LoginResponse = await res.json()
//       setResponse(data)

//       if (loginEndpoint === "/operations/login") {
//         if (data?.message === "Login successful") {
//           setName(data.user.name)
//           setEmailOperations(data.user.email)
//           setRole(data.user.role)
//           setManagedUsers(data.user.managedUsers)
//           toastUtils.dismissToast(loadingToast)
//           toastUtils.success("Welcome to Operations Dashboard!")
//           navigate("/manage")
//         } else {
//           toastUtils.dismissToast(loadingToast)
//           toastUtils.error(data?.message || toastMessages.loginError)
//         }
//       } else {
//         if (data?.message === "Login Success..!") {
//           setData?.({
//             userDetails: data?.userDetails,
//             token: data?.token || "",
//           })
//           setProfileFromApi(data?.userProfile)
          
//           sessionStorage.setItem('hasProfile', data?.hasProfile ? 'true' : 'false')
          
//           localStorage.setItem(
//             "userAuth",
//             JSON.stringify({
//               token: data?.token,
//               userDetails: data?.userDetails,
//               userProfile: data?.userProfile,
//             }),
//           )
//           toastUtils.dismissToast(loadingToast)
//           toastUtils.success(toastMessages.loginSuccess)
//           navigate("/")
//         } else {
//           setData?.({
//             userDetails: null,
//             token: "",
//           })
//           toastUtils.dismissToast(loadingToast)
//           toastUtils.error(data?.message || toastMessages.loginError)
//         }
//       }
//     } catch (err) {
//       console.error(err)
//       toastUtils.dismissToast(loadingToast)
//       toastUtils.error(toastMessages.networkError)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-orange-50 via-white to-red-50">
//       {/* LEFT PANEL */}
//       <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 lg:py-16 relative border-b lg:border-b-0 lg:border-r border-gray-200">
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>
//         </div>

//         <div className="relative z-10 max-w-xl mx-auto lg:mx-0">
//           <div className="flex items-center gap-3 mb-2">
//             <img src="/Logo.png" alt="Flashfire Logo" className="w-10 h-10 md:w-12 md:h-12" />
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent">
//                 FLASHFIRE
//               </h1>
//               <p className="text-xs text-gray-600">AI-Powered Resume Optimization</p>
//             </div>
//           </div>

//           <div className="mb-4">
//             <p className="text-sm font-medium text-orange-600 mb-1 tracking-wide uppercase">Welcome Back</p>
//             <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-3">
//               Transform Your{" "}
//               <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
//                 Career Journey
//               </span>
//             </h2>
//             <p className="text-lg text-gray-700 leading-relaxed">
//               Join professionals who landed dream jobs with AI-optimized resumes that beat ATS.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-4 mb-8">
//             {statsData.map((stat, i) => (
//               <div
//                 key={i}
//                 className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-5 hover:bg-white hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-default"
//               >
//                 <div className="flex items-center gap-3 mb-1">
//                   <div className={`${stat.color} transition-transform group-hover:scale-110`}>{stat.icon}</div>
//                   <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
//                 </div>
//                 <p className="text-sm text-gray-600">{stat.label}</p>
//               </div>
//             ))}
//           </div>

//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <CheckCircle className="w-4 h-4 text-emerald-600" />
//             <span>Secure & Private</span>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT PANEL - WHITE CARD */}
//       <div className="w-full lg:w-[480px] xl:w-[560px] flex flex-col justify-center px-6 md:px-12 py-12 bg-gray-50">
//         <div className="max-w-md mx-auto w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-7 md:p-8">
//           {/* Header */}
//           <div className="mb-6">
//             <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
//             <p className="text-sm text-gray-600">Enter your credentials to access your account</p>
//           </div>

//           {/* Tabs */}
//           <div className="flex justify-center mb-6 border-b border-gray-200">
//             <button className="px-4 py-2 text-orange-600 font-semibold border-b-2 border-orange-600 -mb-[2px] text-sm">
//               Login
//             </button>
//           </div>

//           {/* Google Login Button */}
//           <div className="w-full my-6 flex justify-center pl-15">
//             <GoogleLogin
//               theme="outline"
//               size="large"
//               onSuccess={async (credentialResponse) => {
//                 const loadingToast = toastUtils.loading(toastMessages.loggingIn)
//                 try {
//                   const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/google-oauth`, {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ token: credentialResponse.credential }),
//                   })
//                   const data = await res.json()

//                   if (data?.message === "User not found") {
//                     toastUtils.error(data?.message)
//                     toastUtils.dismissToast(loadingToast)
//                     return
//                   }

//                   if (data?.user?.email?.includes("@flashfirehq")) {
//                     setName(data.user.name)
//                     setEmailOperations(data.user.email)
//                     setRole(data.user.role)
//                     setManagedUsers(data.user.managedUsers)
//                     toastUtils.dismissToast(loadingToast)
//                     toastUtils.success("Welcome to Operations Dashboard!")
//                     navigate("/manage")
//                   } else {
//                     setData?.({
//                       userDetails: data?.userDetails,
//                       token: data?.token || "",
//                     })
//                     setProfileFromApi(data?.userProfile)
                    
//                     sessionStorage.setItem('hasProfile', data?.hasProfile ? 'true' : 'false')
                    
//                     localStorage.setItem(
//                       "userAuth",
//                       JSON.stringify({
//                         token: data?.token,
//                         userDetails: data?.userDetails,
//                         userProfile: data?.userProfile,
//                       }),
//                     )
//                     toastUtils.dismissToast(loadingToast)
//                     toastUtils.success(toastMessages.loginSuccess)
//                     navigate("/")
//                   }
//                 } catch (err) {
//                   console.error(err)
//                   toastUtils.dismissToast(loadingToast)
//                   toastUtils.error(toastMessages.networkError)
//                 }
//               }}
//               onError={() => {
//                 toastUtils.error("Google login failed. Please try again.")
//               }}
//               useOneTap
//             />
//           </div>

//           {/* Divider */}
//           <div className="flex items-center justify-center mb-6">
//             <hr className="flex-1 border-gray-300" />
//             <span className="mx-3 text-gray-500 text-xs font-medium">OR</span>
//             <hr className="flex-1 border-gray-300" />
//           </div>

//           {/* Form */}
//           <form onSubmit={handleLogin} className="space-y-4">
//             {/* Email */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-900 mb-1">Email *</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="email"
//                   placeholder="example@email.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-sm"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-900 mb-1">Password *</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-sm"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>

//             {/* Sign In Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full mt-5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed group text-sm"
//             >
//               {isLoading ? (
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               ) : (
//                 <>
//                   <span className="text-sm">Sign In</span>
//                   <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//                 </>
//               )}
//             </button>
//           </form>

//         </div>
//       </div>
//     </div>
//   )
// }

import React, { useState, useContext, createContext, type FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock, CheckCircle, TrendingUp, Users, Award, Clock, ArrowRight } from "lucide-react";

// --- MOCKED DEPENDENCIES & PROVIDERS --- //
// In a real project, these would be in separate files. For this example, they are
// included here to make the component runnable and fix the import errors.

// Mock Toast Notification System
const ToastContext = createContext(null);
const useToasts = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const addToast = (message, type) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
        return id;
    };
    const removeToast = id => setToasts(prev => prev.filter(t => t.id !== id));
    
    const toastUtils = {
        loading: (message) => addToast(message, 'loading'),
        success: (message) => addToast(message, 'success'),
        error: (message) => addToast(message, 'error'),
        dismissToast: (id) => removeToast(id),
    };
    
    const toastMessages = {
        loggingIn: "Logging in...",
        loginSuccess: "Login successful! Welcome back.",
        networkError: "A network error occurred.",
    };

    const toastStyles = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        loading: "bg-blue-500 text-white",
    };

    return (
        <ToastContext.Provider value={{ toastUtils, toastMessages }}>
            {children}
            <div className="fixed top-5 right-5 z-50 space-y-2">
                {toasts.map(toast => (
                    <div key={toast.id} className={`px-4 py-2 rounded-md shadow-lg text-sm font-medium animate-pulse ${toastStyles[toast.type]}`}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};


// Mock Contexts and Stores
const UserContext = createContext(null);
const ProfileContext = createContext(null);
const useUserProfile = () => useContext(ProfileContext);
const useOperationsStore = () => {
    const [store, setStore] = useState({ name: "", email: "", role: "", managedUsers: [] });
    return {
        ...store,
        setName: (name) => setStore(s => ({ ...s, name })),
        setEmailOperations: (email) => setStore(s => ({ ...s, email })),
        setRole: (role) => setStore(s => ({ ...s, role })),
        setManagedUsers: (users) => setStore(s => ({ ...s, managedUsers: users })),
    };
};

// Mock GoogleLogin Component
const GoogleLogin = ({ onSuccess, onError, ...props }) => (
    <button
        type="button"
        onClick={() => onSuccess({ credential: "mock-google-credential" })}
        className="px-4 py-2 border flex justify-center items-center gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150 w-full"
    >
        <img className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
        <span>{props.text === "continue_with" ? "Continue with Google" : "Sign in with Google"}</span>
    </button>
);


// --- HELPER FUNCTIONS --- //

const handleAuthSuccess = (data, navigate, userContext, profileContext, operationsStore, toastUtils, toastMessages) => {
    const { setData } = userContext || {};
    const { setProfileFromApi } = profileContext;
    const { setName, setEmailOperations, setRole, setManagedUsers } = operationsStore;

    const isOperationsUser = data.user?.email?.includes("@flashfirehq");

    if (isOperationsUser) {
        setName(data.user.name);
        setEmailOperations(data.user.email);
        setRole(data.user.role);
        setManagedUsers(data.user.managedUsers || []);
        toastUtils.success("Welcome to Operations Dashboard!");
        navigate("/manage");
    } else {
        setData?.({ userDetails: data.userDetails, token: data.token || "" });
        setProfileFromApi(data.userProfile);
        sessionStorage.setItem('hasProfile', data.hasProfile ? 'true' : 'false');
        localStorage.setItem("userAuth", JSON.stringify({
            token: data.token,
            userDetails: data.userDetails,
            userProfile: data.userProfile,
        }));
        toastUtils.success(toastMessages.loginSuccess);
        navigate("/");
    }
};

// --- UI DATA & COMPONENTS --- //

const statsData = [
    { value: "95%", label: "Success Rate", icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-600" },
    { value: "300K+", label: "Applications Sent", icon: <Users className="w-5 h-5" />, color: "text-blue-600" },
    { value: "97%", label: "ATS Score", icon: <Award className="w-5 h-5" />, color: "text-orange-600" },
    { value: "24/7", label: "AI Working", icon: <Clock className="w-5 h-5" />, color: "text-purple-600" },
];

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { toastUtils, toastMessages } = useToasts();
    
    // Mocking React Router's navigate function
    const navigate = (path) => console.log(`Navigating to: ${path}`);
    
    // Mocking context values
    const userContext = { setData: (data) => console.log("UserContext updated:", data) };
    const profileContext = { setProfileFromApi: (data) => console.log("ProfileContext updated:", data) };
    const operationsStore = useOperationsStore();

    const performAuthRequest = async (endpoint, body) => {
        setIsLoading(true);
        const loadingToast = toastUtils.loading(toastMessages.loggingIn);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Mock API Response Logic
            const isOpsRequest = endpoint.includes("operations") || email.includes("@flashfirehq");
            const shouldSucceed = Math.random() > 0.1; // 90% chance of success

            if (!shouldSucceed) {
                 throw new Error( "User not found" );
            }

            const data = isOpsRequest
                ? { message: "Login successful", user: { name: "Admin User", email: "admin@flashfirehq.com", role: "admin", managedUsers: [] } }
                : { message: "Login Success..!", token: "jwt-token-123", userDetails: { name: "John Doe", email }, userProfile: { bio: "Test bio" }, hasProfile: true };
            
            toastUtils.dismissToast(loadingToast);
            handleAuthSuccess(data, navigate, userContext, profileContext, operationsStore, toastUtils, toastMessages);

        } catch (err) {
            toastUtils.dismissToast(loadingToast);
            const errorMessage = err.message === "User not found"
                ? "Account does not exist. Please register first."
                : err.message || toastMessages.networkError;
            toastUtils.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toastUtils.error("Email and Password are required!");
            return;
        }
        const endpoint = email.toLowerCase().includes("@flashfirehq") ? "/operations/login" : "/login";
        performAuthRequest(endpoint, { email, password });
    };

    const handleGoogleLoginSuccess = (credentialResponse) => {
        performAuthRequest("/google-oauth", { token: credentialResponse.credential });
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-orange-50 via-white to-red-50">
            {/* Left Panel */}
             <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 lg:py-16 relative border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 max-w-xl mx-auto lg:mx-0">
                    <div className="flex items-center gap-3 mb-2">
                        <img src="https://placehold.co/48x48/FF5733/FFFFFF?text=F" alt="Flashfire Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent">FLASHFIRE</h1>
                            <p className="text-xs text-gray-600">AI-Powered Resume Optimization</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm font-medium text-orange-600 mb-1 tracking-wide uppercase">Welcome Back</p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-3">
                            Transform Your <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Career Journey</span>
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">Join professionals who landed dream jobs with AI-optimized resumes that beat ATS.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {statsData.map((stat, i) => (
                            <div key={i} className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-5 hover:bg-white hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-default">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className={`${stat.color} transition-transform group-hover:scale-110`}>{stat.icon}</div>
                                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                                </div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Secure & Private</span>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-[480px] xl:w-[560px] flex flex-col justify-center px-6 md:px-12 py-12 bg-gray-50">
                <div className="max-w-md mx-auto w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-7 md:p-8">
                    <div className="mb-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
                        <p className="text-sm text-gray-600">Enter your credentials to access your account</p>
                    </div>
                    <div className="flex justify-center mb-6 border-b border-gray-200">
                        <button className="px-4 py-2 text-orange-600 font-semibold border-b-2 border-orange-600 -mb-[2px] text-sm">Login</button>
                    </div>
                    <div className="w-full my-6 flex justify-center">
                        <GoogleLogin
                            theme="outline"
                            size="large"
                            shape="rectangular"
                            text="continue_with"
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => toastUtils.error("Google login failed. Please try again.")}
                        />
                    </div>
                    <div className="flex items-center justify-center mb-6">
                        <hr className="flex-1 border-gray-300" />
                        <span className="mx-3 text-gray-500 text-xs font-medium">OR</span>
                        <hr className="flex-1 border-gray-300" />
                    </div>
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-900 mb-1">Email *</label>
                            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-sm" /></div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-900 mb-1">Password *</label>
                            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-sm" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full mt-5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed group text-sm">{isLoading ? (<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />) : (<><span>Sign In</span><ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>)}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Main App component to wrap Login with necessary providers
export default function App() {
    return (
        <ToastProvider>
            <Login />
        </ToastProvider>
    );
}




