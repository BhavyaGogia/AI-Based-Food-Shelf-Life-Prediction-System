import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CosmicCanvas from '../components/CosmicCanvas'

export default function Login() {
  const mainRef = useRef(null)
  const navigate = useNavigate()
  const { login, register, googleLogin, isAuthenticated } = useAuth()
  
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    let result;
    if (isLoginMode) {
      result = await login(email, password)
    } else {
      result = await register(username, email, password)
    }

    if (result.success) {
      // If success, checks role in useEffect/ProtectedRoute to direct to /onboarding if needed
      navigate('/dashboard')
    } else {
      setError(result.error || `${isLoginMode ? 'Login' : 'Registration'} failed`)
    }
  }

  const handleQuickLogin = async (role) => {
    setError('')
    const userMap = {
      'production_staff': { e: 'staff@himshakti.com', p: 'himshakti123' },
      'lab_admin': { e: 'admin@himshakti.com', p: 'himshakti123' }
    }
    const creds = userMap[role]
    if (creds) {
      const result = await login(creds.e, creds.p)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'Quick login failed. Did you seed the database with emails?')
      }
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    }, { threshold: 0.1 })
    
    if (mainRef.current) {
      const elements = mainRef.current.querySelectorAll('.reveal-left, .reveal-right')
      elements.forEach(el => observer.observe(el))
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-500 font-body">
      <CosmicCanvas />
      <Navbar />

      <main className="flex-grow flex relative overflow-hidden pt-24 z-10" ref={mainRef}>
        
        {/* Left Side: Brand Story */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-transparent p-20 flex-col justify-center text-slate-900 dark:text-white overflow-hidden border-r border-slate-200/20 dark:border-white/5 transition-colors duration-500">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-neon/5 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-violet/5 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-lg reveal-left">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 border border-emerald-500/10 dark:border-white/10 text-emerald-700 dark:text-neon text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-sm dark:shadow-glow">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-neon animate-ping"></span>
              Secure Staff Portal
            </div>
            
            <h1 className="font-heading font-extrabold text-5xl xl:text-7xl leading-[1.05] mb-6 tracking-tight text-slate-900 dark:text-white">
              Welcome to the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-emerald-700 to-teal-600 dark:from-white dark:via-neon dark:to-emerald-400">
                Future of Food
              </span>
            </h1>
            
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-12 font-medium">
              Access the HimShakti AI dashboard to predict shelf life, manage ingredient quality, and optimize your production lines with absolute precision.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 bg-transparent relative z-10 transition-colors duration-500">
          <div className="w-full max-w-md reveal-right">
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="font-heading font-extrabold text-4xl text-slate-900 dark:text-white">
                Access Portal
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg font-medium">
                Sign in to manage and predict shelf life
              </p>
            </div>

            {error && (
              <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Google OAuth Hero Button */}
            <div className="mb-6 w-full flex justify-center">
              <div className="w-full shadow-lg rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                <GoogleLoginWrapper onSuccess={async (res) => {
                  if (res.credential) {
                     const apiRes = await googleLogin(res.credential);
                     if (apiRes.success) navigate('/dashboard');
                     else setError(apiRes.error);
                  }
                }} onError={() => setError('Google Login Failed')} />
              </div>
            </div>

            {/* Direct Switch/Onboarding Link */}
            <div className="text-center mt-4 mb-6">
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  const newMode = !isLoginMode;
                  setIsLoginMode(newMode);
                  if (!newMode) {
                    setShowEmailForm(true); // auto-expand to show fields when registering
                  }
                }}
                className="text-sm font-bold text-emerald-600 dark:text-neon hover:underline focus:outline-none"
              >
                {isLoginMode ? 'Register here' : 'Sign In'}
              </button>
            </div>

            {isLoginMode && (
              <div className="relative flex items-center py-2 mb-4">
                <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
                <button 
                  onClick={() => setShowEmailForm(!showEmailForm)}
                  className="flex-shrink-0 mx-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-neon transition-colors focus:outline-none"
                >
                  {showEmailForm ? 'Hide email sign in ↑' : 'Or sign in with email instead ↓'}
                </button>
                <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
              </div>
            )}

            {/* Collapsible Email/Password & Registration Form */}
            {showEmailForm && (
              <div className="space-y-6 transition-all duration-500 ease-in-out">
                
                <form id="auth-form" onSubmit={handleManualSubmit} className="space-y-4">
                  {!isLoginMode && (
                    <div className="relative group">
                      <input
                        id="auth-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="peer w-full px-5 pt-6 pb-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-neon/50 focus:border-emerald-600 dark:focus:border-neon text-slate-900 dark:text-white transition-all placeholder-transparent"
                        placeholder="Username"
                        required={!isLoginMode}
                      />
                      <label htmlFor="auth-username" className="absolute left-5 top-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 transition-all peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-neon pointer-events-none">
                        Username
                      </label>
                    </div>
                  )}

                  <div className="relative group">
                    <input
                      id="auth-email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="peer w-full px-5 pt-6 pb-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-neon/50 focus:border-emerald-600 dark:focus:border-neon text-slate-900 dark:text-white transition-all placeholder-transparent"
                      placeholder="Email"
                      autoComplete="email"
                      required
                    />
                    <label htmlFor="auth-email" className="absolute left-5 top-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 transition-all peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-neon pointer-events-none">
                      Email
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer w-full px-5 pt-6 pb-2 pr-12 rounded-xl border border-slate-300 dark:border-white/15 bg-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-neon/50 focus:border-emerald-600 dark:focus:border-neon text-slate-900 dark:text-white transition-all placeholder-transparent"
                      placeholder="Password"
                      autoComplete={isLoginMode ? "current-password" : "new-password"}
                      required
                    />
                    <label htmlFor="auth-password" className="absolute left-5 top-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 transition-all peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-neon pointer-events-none">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-neon transition-colors"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-4 text-lg mt-4 shadow-md dark:shadow-glow hover:scale-[1.02]"
                  >
                    {isLoginMode ? 'Sign In' : 'Create Account'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

import { GoogleLogin } from '@react-oauth/google';

function GoogleLoginWrapper({ onSuccess, onError }) {
  return (
    <div className="w-full flex justify-center">
      <GoogleLogin 
        onSuccess={onSuccess} 
        onError={onError} 
        useOneTap
        shape="pill"
        size="large"
        width="384px"
        theme="filled_blue"
      />
    </div>
  )
}
