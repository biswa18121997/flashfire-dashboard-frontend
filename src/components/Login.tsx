import { useState, useContext, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, CheckCircle, TrendingUp, Users, Award, Clock, ArrowRight } from "lucide-react"
import { UserContext } from "../state_management/UserContext"
import { useUserProfile } from "../state_management/ProfileContext"
import { useOperationsStore } from "../state_management/Operations"
import { toastUtils, toastMessages } from "../utils/toast"

// Google API types
declare global {
  interface Window {
    google: any
  }
}

interface LoginResponse {
  message: string
  token?: string
  userDetails?: any
  userProfile?: any
  user?: any
}

const statsData = [
  {
    value: "95%",
    label: "Success Rate",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-emerald-600",
  },
  {
    value: "300K+",
    label: "Applications Sent",
    icon: <Users className="w-5 h-5" />,
    color: "text-blue-600",
  },
  {
    value: "97%",
    label: "ATS Score",
    icon: <Award className="w-5 h-5" />,
    color: "text-orange-600",
  },
  {
    value: "24/7",
    label: "AI Working",
    icon: <Clock className="w-5 h-5" />,
    color: "text-purple-600",
  },
]

export default function Login() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [, setResponse] = useState<LoginResponse | null>(null)

  const navigate = useNavigate()
  const { setName, setEmailOperations, setRole, setManagedUsers } = useOperationsStore()
  const userContext = useContext(UserContext)
  const setData = userContext?.setData
  const { setProfileFromApi } = useUserProfile()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toastUtils.error("Email and Password are required!")
      return
    }

    setIsLoading(true)
    const loadingToast = toastUtils.loading(toastMessages.loggingIn)
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
      const loginEndpoint = email.toLowerCase().includes("@flashfirehq") ? "/operations/login" : "/login"
      const res = await fetch(`${API_BASE_URL}${loginEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data: LoginResponse = await res.json()
      setResponse(data)

      if (loginEndpoint === "/operations/login") {
        if (data?.message === "Login successful") {
          setName(data.user.name)
          setEmailOperations(data.user.email)
          setRole(data.user.role)
          setManagedUsers(data.user.managedUsers)
          toastUtils.dismissToast(loadingToast)
          toastUtils.success("Welcome to Operations Dashboard!")
          navigate("/manage")
        } else {
          toastUtils.dismissToast(loadingToast)
          toastUtils.error(data?.message || toastMessages.loginError)
        }
      } else {
        if (data?.message === "Login Success..!") {
          setData?.({
            userDetails: data?.userDetails,
            token: data?.token || "",
          })
          setProfileFromApi(data?.userProfile)
          localStorage.setItem(
            "userAuth",
            JSON.stringify({
              token: data?.token,
              userDetails: data?.userDetails,
              userProfile: data?.userProfile,
            }),
          )
          toastUtils.dismissToast(loadingToast)
          toastUtils.success(toastMessages.loginSuccess)
          navigate("/")
        } else {
          setData?.({
            userDetails: null,
            token: ""
          })
          toastUtils.dismissToast(loadingToast)
          toastUtils.error(data?.message || toastMessages.loginError)
        }
      }
    } catch (err) {
      console.error(err)
      toastUtils.dismissToast(loadingToast)
      toastUtils.error(toastMessages.networkError)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const loadingToast = toastUtils.loading(toastMessages.loggingIn)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/google-oauth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      })
      const data = await res.json()
      
      if (data?.message === "User not found") {
        toastUtils.error(data?.message)
        toastUtils.dismissToast(loadingToast)
        return
      }

      if (data?.user?.email?.includes("@flashfirehq")) {
        setName(data.user.name)
        setEmailOperations(data.user.email)
        setRole(data.user.role)
        setManagedUsers(data.user.managedUsers)
        toastUtils.dismissToast(loadingToast)
        toastUtils.success("Welcome to Operations Dashboard!")
        navigate("/manage")
      } else {
        setData?.({
          userDetails: data?.userDetails,
          token: data?.token || "",
        })
        setProfileFromApi(data?.userProfile)
        localStorage.setItem(
          "userAuth",
          JSON.stringify({
            token: data?.token,
            userDetails: data?.userDetails,
            userProfile: data?.userProfile,
          }),
        )
        toastUtils.dismissToast(loadingToast)
        toastUtils.success(toastMessages.loginSuccess)
        navigate("/")
      }
    } catch (err) {
      console.error(err)
      toastUtils.dismissToast(loadingToast)
      toastUtils.error(toastMessages.networkError)
    }
  }


  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* LEFT PANEL */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 lg:py-16 relative border-b lg:border-b-0 lg:border-r border-gray-200">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-xl mx-auto lg:mx-0">
          <div className="flex items-center gap-3 mb-2">
            <img src="/Logo.png" alt="Flashfire Logo" className="w-10 h-10 md:w-12 md:h-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent">
                FLASHFIRE
              </h1>
              <p className="text-xs text-gray-600">AI-Powered Resume Optimization</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-orange-600 mb-1 tracking-wide uppercase">Welcome Back</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-3">
              Transform Your{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Career Journey
              </span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Join professionals who landed dream jobs with AI-optimized resumes that beat ATS.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {statsData.map((stat, i) => (
              <div
                key={i}
                className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-5 hover:bg-white hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-default"
              >
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

      {/* RIGHT PANEL - WHITE CARD */}
      <div className="w-full lg:w-[480px] xl:w-[560px] flex flex-col justify-center px-6 md:px-12 py-12 bg-gray-50">
        <div className="max-w-md mx-auto w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-7 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
            <p className="text-sm text-gray-600">Enter your credentials to access your account</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6 border-b border-gray-200">
            <button className="px-4 py-2 text-orange-600 font-semibold border-b-2 border-orange-600 -mb-[2px] text-sm">
              Login
            </button>
          </div>

          {/* Google Login Button - Custom Implementation */}
          <div className="w-full mb-5">
            <button
              onClick={() => {
                const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
                
                if (!clientId) {
                  toastUtils.error('Google OAuth client ID not configured');
                  return;
                }

                // Load Google Identity Services and use ID token flow
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.onload = () => {
                  if (!window.google || !window.google.accounts?.id) {
                    toastUtils.error('Google login failed. Please try again.');
                    return;
                  }

                  try {
                    // Initialize ID token flow (returns JWT in callback as `credential`)
                    window.google.accounts.id.initialize({
                      client_id: clientId,
                      callback: async (response: any) => {
                        if (response?.credential) {
                          // Send ID token (JWT) to backend, which expects `token: credential`
                          await handleGoogleSuccess({ credential: response.credential });
                        } else {
                          toastUtils.error('Google login failed. Please try again.');
                        }
                      },
                    });

                    // Show a popup prompt to pick account; keeps our custom button UI
                    window.google.accounts.id.prompt((notification: any) => {
                      if (notification?.isNotDisplayed() || notification?.isSkippedMoment()) {
                        // If One Tap cannot display, fallback to explicit account chooser
                        try {
                          window.google.accounts.id.prompt();
                        } catch (_) {
                          toastUtils.error('Google login was cancelled or blocked.');
                        }
                      }
                    });
                  } catch (_e) {
                    toastUtils.error('Google login failed. Please try again.');
                  }
                };
                script.onerror = () => {
                  toastUtils.error('Failed to load Google login. Please try again.');
                };
                document.head.appendChild(script);
              }}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm">Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center mb-5">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-3 text-gray-500 text-xs font-medium">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed group text-sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-sm">Sign In</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
