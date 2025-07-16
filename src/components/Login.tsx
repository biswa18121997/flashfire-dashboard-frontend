// import { useState,useContext } from "react"
// import { Link, useNavigate } from "react-router-dom";
// import {UserContext} from '../state_management/UserContext.tsx'
// import { X } from "lucide-react";


// export default  function Login(){

//     const [show, setShow] = useState(false);
//     let [email,setEmail] = useState('');
//     let [password,setPassword] =useState('');
//     let [response , setResponse] = useState();
//     let navigate = useNavigate();
//     let {setData}  = useContext(UserContext);
// //login page component..
//     async function handleLogin(){
//         console.log(email, password,'from login..')
//         try {
//             //sending email pass to middlewares..
            
//             const res = await fetch('http://localhost:8086/login', { // Change URL if needed
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, password })
//             });
//             let data = await res.json();
//             console.log(data)
//             setResponse(data);
//           if(data?.message =='Login Sucess..!'){
//             setData({ userDetails: data.userDetails ,token: data.token});
//             navigate('/');
//           }
//           else{ 
//             setData({});
            
//           }
//         } catch (error) {
//             console.log(error)
//         }
//     }


//     return(<div className="w-[80vw] relative left-[20vw] h-screen top-[20vh] sm:top-[15vh] md:top-[12vh] ">
        
//         <span onClick={()=>navigate('/')}><X  className="hover:bg-neutral-400 rounded-full m-2"/></span>

//         <div className="flex flex-col justify-center items-center h-4/5 w-3/4 ">
//             <h1 className="text-3xl font-serif underline underline-offset-8">Login / Sign in User :</h1><br /><br />
//             <hr />
//             <i className="fa-solid fa-user p-2 m-2 rounded-2xl text-4xl border-2 "></i>


//             <div  className="flex flex-col justify-start items-start border p-4 rounded-2xl w-2/3 w-[80vw] md:w-2/3">
//                 <label htmlFor="loginmail" className="">Registered  Email :</label>
//                 <input type="text" name="email" onChange={(e)=>setEmail(e.target.value)} id="loginmail" placeholder="Enter Your Registered E-mail.." className="p-2 bg-neutral-400 w-full rounded-3xl m-2" />
//                 <label htmlFor="loginpassword">Password :</label>
//                 <section className="w-full flex justify-center items-center">
//                 <input type={show?'text':'password'} name="password"  onChange={(e)=>setPassword(e.target.value)} id="loginpassword" placeholder="Enter your password " className="p-2 bg-neutral-400 w-full rounded-3xl m-2"/>
//                 <i onClick={()=>setShow(!show)} className={show?'fa-solid fa-eye':'fa-solid fa-eye-low-vision' }></i>
//                 </section>
//                 <p className="text-blue-700 underline underline-offset-8 m-1" onClick={()=>alert('No Worries just Create a New One.')}>Forgot your Password .? </p>
                
//                     <button onClick={handleLogin} className="p-2 m-2 rounded-2xl border w-full">Login</button> 
//                     <Link to={'/register'} className="w-full">
//                         <button  className="p-2 m-2 rounded-2xl border w-full bg-green-400">Register</button> 
//                     </Link>

//                     {response?.message && <h2 className="text-center text-red-400 font font-semibold">{response?.message}</h2>}

//             </div>
//         </div>
//     </div>)
// }




//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, FileText, Zap, CheckCircle, ArrowRight, TrendingUp, Users, Award, Clock } from 'lucide-react';

// interface SignUpPageProps {
//   onSignUp: (email: string, password: string) => void;
//   onSwitchToLogin: () => void;
// }

// const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onSwitchToLogin }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validatePassword = (password: string) => {
//     return password.length >= 8;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const newErrors: { email?: string; password?: string } = {};
    
//     if (!email) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     if (!password) {
//       newErrors.password = 'Password is required';
//     } else if (!validatePassword(password)) {
//       newErrors.password = 'Password must be at least 8 characters long';
//     }
    
//     setErrors(newErrors);
    
//     if (Object.keys(newErrors).length === 0) {
//       setIsLoading(true);
//       setTimeout(() => {
//         onSignUp(email, password);
//         setIsLoading(false);
//       }, 1500);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
//       {/* Left Panel - Information Section */}
//       <div className="flex-1 flex flex-col justify-center px-16 py-12 relative overflow-hidden">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-20 left-20 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
//           <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
//         </div>

//         <div className="relative z-10 max-w-lg">
//           {/* Logo and Brand */}
//           <div className="flex items-center space-x-4 mb-12">
//             <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
//               <FileText className="w-9 h-9 text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
//                 FLASHFIRE
//               </h1>
//               <p className="text-blue-200 text-sm font-medium">AI-Powered Resume Optimization</p>
//             </div>
//           </div>

//           {/* Main Heading */}
//           <div className="mb-12">
//             <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
//               Transform Your
//               <span className="block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
//                 Career Journey
//               </span>
//             </h2>
//             <p className="text-xl text-blue-200 leading-relaxed">
//               Join thousands of professionals who've landed their dream jobs with AI-optimized resumes that beat ATS systems every time.
//             </p>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-2 gap-6 mb-12">
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
//               <div className="flex items-center space-x-3 mb-3">
//                 <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
//                   <TrendingUp className="w-6 h-6 text-green-400" />
//                 </div>
//                 <div>
//                   <p className="text-3xl font-bold text-white">95%</p>
//                   <p className="text-blue-200 text-sm">Success Rate</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
//               <div className="flex items-center space-x-3 mb-3">
//                 <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                   <Users className="w-6 h-6 text-purple-400" />
//                 </div>
//                 <div>
//                   <p className="text-3xl font-bold text-white">50K+</p>
//                   <p className="text-blue-200 text-sm">Users Hired</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
//               <div className="flex items-center space-x-3 mb-3">
//                 <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
//                   <Award className="w-6 h-6 text-orange-400" />
//                 </div>
//                 <div>
//                   <p className="text-3xl font-bold text-white">97%</p>
//                   <p className="text-blue-200 text-sm">ATS Score</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
//               <div className="flex items-center space-x-3 mb-3">
//                 <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
//                   <Clock className="w-6 h-6 text-blue-400" />
//                 </div>
//                 <div>
//                   <p className="text-3xl font-bold text-white">24/7</p>
//                   <p className="text-blue-200 text-sm">AI Working</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Features List */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-4">
//               <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
//                 <CheckCircle className="w-5 h-5 text-green-400" />
//               </div>
//               <p className="text-blue-200">AI-powered keyword optimization for maximum ATS compatibility</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
//                 <CheckCircle className="w-5 h-5 text-green-400" />
//               </div>
//               <p className="text-blue-200">Smart job tracking and application management system</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
//                 <CheckCircle className="w-5 h-5 text-green-400" />
//               </div>
//               <p className="text-blue-200">Real-time resume analysis and improvement suggestions</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right Panel - Sign In Form */}
//       <div className="w-[480px] bg-white flex flex-col justify-center px-12 py-12 relative">
//         {/* Subtle Background Pattern */}
//         <div className="absolute inset-0 opacity-5">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500 to-red-500 rounded-full transform translate-x-32 -translate-y-32"></div>
//           <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full transform -translate-x-32 translate-y-32"></div>
//         </div>

//         <div className="relative z-10">
//           {/* Header */}
//           <div className="text-center mb-10">
//             <h3 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h3>
//             <p className="text-gray-600 text-lg">Sign in to continue your career journey</p>
//           </div>

//           {/* Sign In Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg ${
//                     errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-orange-500'
//                   }`}
//                   placeholder="Enter your email address"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-2 text-sm text-red-600 flex items-center">
//                   <span className="w-4 h-4 mr-1">⚠️</span>
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg ${
//                     errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-orange-500'
//                   }`}
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-4 flex items-center"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-2 text-sm text-red-600 flex items-center">
//                   <span className="w-4 h-4 mr-1">⚠️</span>
//                   {errors.password}
//                 </p>
//               )}
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                   Remember me
//                 </label>
//               </div>
//               <div className="text-sm">
//                 <a href="#" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
//                   Forgot password?
//                 </a>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 text-lg"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
//                   <span>Signing In...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Sign In</span>
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="my-8">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-200" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-white text-gray-500">New to FLASHFIRE?</span>
//               </div>
//             </div>
//           </div>

//           {/* Create Account Button */}
//           <button
//             onClick={onSwitchToLogin}
//             className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 text-lg"
//           >
//             Create New Account
//           </button>

//           {/* Trust Indicators */}
//           <div className="mt-8 pt-6 border-t border-gray-100">
//             <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
//               <div className="flex items-center space-x-2">
//                 <CheckCircle className="w-4 h-4 text-green-500" />
//                 <span>Secure & Private</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <CheckCircle className="w-4 h-4 text-green-500" />
//                 <span>Free to Start</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <CheckCircle className="w-4 h-4 text-green-500" />
//                 <span>No Spam</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SignUpPage;

// ========================================================================================================================================================================================================


import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle,TrendingUp, Users, Award, Clock, Cross, X } from "lucide-react";
import { UserContext } from "../state_management/UserContext";

interface LoginResponse {
  message: string;
  token?: string;
  userDetails?: any; 
}



export default function LoginPage({activeTab, onTabChange}: {activeTab: string, onTabChange: (tab: string) => void}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [response, setResponse] = useState<LoginResponse | null>(null);

  const navigate = useNavigate();
  const { setData } = useContext(UserContext);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    return errs;
  };


const statsData = [
  {
    value: "95%",
    label: "Success Rate",
    icon: <TrendingUp className="w-5 h-5 text-green-400" />,
  },
  {
    value: "50K+",
    label: "Users Hired",
    icon: <Users className="w-5 h-5 text-purple-400" />,
  },
  {
    value: "97%",
    label: "ATS Score",
    icon: <Award className="w-5 h-5 text-orange-400" />,
  },
  {
    value: "24/7",
    label: "AI Working",
    icon: <Clock className="w-5 h-5 text-blue-400" />,
  },
];



  const StatCard: React.FC<any> = ({ value, label, icon }) => {
  return (
    <div className="bg-neutral-500/20 text-white rounded-xl p-4 w-40 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-green-900/40 p-2 rounded-lg">
          {icon || <TrendingUp className="w-5 h-5 text-green-400" />}
        </div>
        <span className="text-lg font-semibold">{value}</span>
      </div>
      <p className="text-sm text-gray-300">{label}</p>
    </div>
  );
};

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

      const data: LoginResponse = await res.json();
      setResponse(data);

      if (data?.message === "Login Sucess..!") {
        setData({ userDetails: data.userDetails, token: data.token });
        navigate('/'); // Switch to dashboard tab
      } else {
        setData({});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    {/* Left Panel */}
    <div className="flex-1 flex flex-col justify-center px-6 md:px-8 py-8 md:py-8 relative ">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 md:w-72 md:h-72 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 md:w-72 md:h-72 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto md:mx-0 text-center md:text-left">
        <div className="flex justify-center md:justify-start items-center gap-4 mb-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-white text-xl md:text-2xl font-bold">🔥</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              FLASHFIRE
            </h1>
            <p className="text-blue-200 text-xs md:text-sm">AI-Powered Resume Optimization</p>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          Transform Your{" "}
          <span className="block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Career Journey
          </span>
        </h2>

        <p className="text-base md:text-lg text-blue-200 mt-4 mb-6">
          Join thousands of professionals who landed dream jobs with AI-optimized resumes that beat ATS.
        </p>

        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
          {statsData.map((stat, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow hover:scale-105 transition transform"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-white/10 p-2 rounded-lg">{stat.icon}</div>
                <span className="text-lg font-semibold text-white">{stat.value}</span>
              </div>
              <p className="text-xs text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>

        <p className="text-base md:text-lg text-blue-200">
          Sign in to continue your journey toward your dream job.
        </p>
      </div>
    </div>

    {/* Right Panel */}
    <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-6 md:px-12 py-8 md:py-12">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
          <p className="text-sm md:text-lg text-gray-600">Enter your credentials to login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm md:text-base ${
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 rounded-lg border text-sm md:text-base ${
                  errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400" />
                ) : (
                  <Eye className="text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg text-base flex justify-center items-center gap-2 hover:scale-[1.02] transition"
          >
            {isLoading ? (
              <span className="animate-spin border-b-2 border-white w-5 h-5 rounded-full"></span>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight />
              </>
            )}
          </button>

          {/* Response message */}
          {response?.message && (
            <p
              className={`text-center text-sm mt-2 ${
                response?.message === "Login Sucess..!" ? "text-green-500" : "text-red-500"
              }`}
            >
              {response?.message}
            </p>
          )}
        </form>

        <div className="mt-6 flex justify-center gap-3 text-xs text-gray-500">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Secure & Private</span>
        </div>
      </div>
    </div>
  </div>
);

}
