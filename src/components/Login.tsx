import { useState, useContext, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, CheckCircle, TrendingUp, Users, Award, Clock, ArrowRight } from "lucide-react"
import { UserContext } from "../state_management/UserContext"
import { useUserProfile } from "../state_management/ProfileContext"
import { useOperationsStore } from "../state_management/Operations"
import { toastUtils, toastMessages } from "../utils/toast"
import { GoogleLogin } from "@react-oauth/google"

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
  const [response, setResponse] = useState<LoginResponse | null>(null)

  const navigate = useNavigate()
  const { setName, setEmailOperations, setRole, setManagedUsers } = useOperationsStore()
  const { setData } = useContext(UserContext)
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
          setData({
            userDetails: data?.userDetails,
            token: data?.token,
            userProfile: data?.userProfile,
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
          setData({})
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

      {/* RIGHT PANEL - Clean Card UI */}
      <div className="w-full lg:w-[480px] xl:w-[560px] flex flex-col justify-center px-6 md:px-12 py-12 bg-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -right-20 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-red-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
            <p className="text-base text-gray-600">Enter your credentials to access your account</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6 border-b border-gray-200">
            <button className="px-4 py-2 text-orange-600 font-semibold border-b-2 border-orange-600">Login</button>
          </div>

          {/* Google Button - KEY FIX HERE */}
          <div className="mb-5 w-full google-login-wrapper">
            <GoogleLogin
              text="continue_with"
              size="large"
              theme="outline"
              width="400"
              shape="rectangular"
              logo_alignment="left"
              onSuccess={async (credentialResponse) => {
                const loadingToast = toastUtils.loading(toastMessages.loggingIn)
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
                  setData({
                    userDetails: data?.userDetails,
                    token: data?.token,
                    userProfile: data?.userProfile,
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
              }}
              onError={() => console.log("Login Failed")}
              useOneTap
            />
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center mb-4">
            <hr className="w-1/3 border-gray-300" />
            <span className="mx-3 text-gray-500 text-sm">OR</span>
            <hr className="w-1/3 border-gray-300" />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-1">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                aria-label="Email address"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-900 mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                aria-label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="group w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sign in"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">Protected by security</p>
          </div>
        </div>
      </div>
    </div>
  )
}
