
import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle,TrendingUp, Users, Award, Clock, Cross, X } from "lucide-react";
import { UserContext } from "../state_management/UserContext";
import { useUserProfile } from "../state_management/ProfileContext";
// import {userP}
// import { GoogleLogin } from '@react-oauth/google';

interface LoginResponse {
  message: string;
  token?: string;
  userDetails?: any; 
  userProfile?:any;
}



export default function LoginPage({activeTab, onTabChange}: {activeTab: string, onTabChange: (tab: string) => void}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [response, setResponse] = useState<LoginResponse | null>(null);
  const [otp, setOtp] = useState("");
const [stage, setStage] = useState<'request'|'verify'>('request');
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const { setData } = useContext(UserContext);
  const { setProfileFromApi } = useUserProfile();
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
async function handleRequestOtp(e: FormEvent) {
  e.preventDefault();
  if (!email) return setResponse({ message: "Email is required" } as any);
  setIsLoading(true);
  try {
    const r = await fetch(`${API_BASE_URL}/auth/request-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await r.json();
    setResponse({ message: r.ok ? "OTP sent to your email" : (data?.message || "Failed to send OTP") } as any);
    if (r.ok) setStage('verify');
  } finally { setIsLoading(false); }
}

async function handleVerifyOtp(e: FormEvent) {
  e.preventDefault();
  if (!email || !otp) return setResponse({ message: "Email and OTP are required" } as any);
  setIsLoading(true);
  try {
    const r = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });
    const data: LoginResponse = await r.json();
    if (r.ok && data?.message === "Login Sucess..!") {
      setData({ userDetails: data.userDetails, token: data.token });
      setProfileFromApi(data.userProfile);
      localStorage.setItem("userAuth", JSON.stringify({
        token: data.token, userDetails: data.userDetails, userProfile: data.userProfile
      }));
      navigate("/");
    } else {
      setResponse({ message: data?.message || "Invalid or expired code" });
    }
  } finally { setIsLoading(false); }
}

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const res = await fetch(`${API_BASE_URL}/login`, { //${API_BASE_URL}
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

      const data: LoginResponse = await res.json();
      setResponse(data);

      if (data?.message === "Login Success..!") {
        setData({ userDetails: data?.userDetails, token: data?.token });
        setProfileFromApi(data.userProfile);
        localStorage.setItem("userAuth", JSON.stringify({ token: data?.token, userDetails: data?.userDetails ,userProfile : data?.userProfile}));
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
        
        {/* <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const res = await fetch("https://flashfire-dashboard-backend-zg4u.onrender.com/googleOAuth", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token: credentialResponse.credential })
                });
                const data = await res.json();
                console.log(data)
                if (data.token) {
                  setData({ userDetails: data.userDetails, token: data.token });
                  localStorage.setItem("userAuth",JSON.stringify({token : data?.token,userDetails : data?.userDetails}));
                  
                  navigate('/');
                } else {
                  setResponse({ message: data.message || 'Login failed' });
                }
  }}
  onError={() => console.log("Login Failed")}
  useOneTap
/> */}
{/* <hr />
<h1 className="text-center font-mono text-xl">OR</h1> */}
        <form onSubmit={stage === 'request' ? handleRequestOtp : handleVerifyOtp} className="space-y-5">
  {/* Email */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
    <div className="relative">
      <Mail className="absolute left-3 top-3 text-gray-400" />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
        placeholder="you@example.com"
      />
    </div>
  </div>

  {stage === 'verify' && (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Enter the 6-digit code</label>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        className="w-full px-4 py-3 rounded-lg border border-gray-300"
        placeholder="123456"
      />
      <button type="button" className="mt-2 text-xs text-indigo-600 underline"
        onClick={() => handleRequestOtp(new Event('submit') as any)}>
        Resend code
      </button>
    </div>
  )}

  <button
    type="submit"
    disabled={isLoading || (stage === 'verify' && otp.length < 4)}
    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg flex justify-center items-center gap-2"
  >
    {isLoading ? 'Please wait…' : (stage === 'request' ? 'Send OTP' : 'Verify & Login')}
  </button>

  {response?.message && (
    <p className={`text-center text-sm mt-2 ${/success/i.test(response.message) ? 'text-green-600' : 'text-gray-700'}`}>
      {response.message}
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
