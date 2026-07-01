import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CosmicCanvas from '../components/CosmicCanvas'

export default function Login() {
  const mainRef = useRef(null)
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  
  const [username, setUsername] = useState('')
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
    const result = await login(username, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const handleQuickLogin = async (role) => {
    setError('')
    // We seeded the DB with 'staff' and 'admin' with password 'himshakti123'
    const userMap = {
      'production_staff': { u: 'staff', p: 'himshakti123' },
      'lab_admin': { u: 'admin', p: 'himshakti123' }
    }
    const creds = userMap[role]
    if (creds) {
      const result = await login(creds.u, creds.p)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'Quick login failed')
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
        
        {/* Left Side: Brand Story (Gradient Split) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-transparent p-20 flex-col justify-center text-slate-900 dark:text-white overflow-hidden border-r border-slate-200/20 dark:border-white/5 transition-colors duration-500">
          {/* Ambient glows */}
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
            
            <div className="flex items-center gap-6 text-slate-700 dark:text-slate-300 text-sm font-bold tracking-wide">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-2xl border-2 border-white dark:border-dark-950 bg-gradient-to-br from-emerald-600 to-teal-400 dark:from-neon dark:to-teal-400 flex items-center justify-center font-extrabold text-white dark:text-dark-950 shadow-sm">HS</div>
                <div className="w-12 h-12 rounded-2xl border-2 border-white dark:border-dark-950 bg-gradient-to-br from-blue-600 to-indigo-500 dark:from-violet dark:to-purple-400 flex items-center justify-center font-extrabold text-white shadow-sm">AI</div>
                <div className="w-12 h-12 rounded-2xl border-2 border-white dark:border-dark-950 bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center font-extrabold text-white dark:text-dark-950 shadow-sm">Lab</div>
              </div>
              <p>Join our team of elite food scientists</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 bg-transparent relative z-10 transition-colors duration-500">
          <div className="w-full max-w-md reveal-right">
            
            <div className="mb-10 lg:hidden text-center">
              <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-black/10 dark:border-white/15 shadow-inner">
                🌾
              </div>
              <h2 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">Staff Login</h2>
            </div>
            
            <div className="hidden lg:block mb-10">
              <h2 className="font-heading font-extrabold text-4xl text-slate-900 dark:text-white">Sign In</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg font-medium">Enter your credentials to continue</p>
            </div>

            {/* Quick Demo Login Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button onClick={() => handleQuickLogin('production_staff')} className="group flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/10 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-white/10 transition-all shadow-sm hover:border-emerald-500/40 dark:hover:border-neon/40 backdrop-blur-md">
                <div className="w-12 h-12 mb-2 rounded-full bg-emerald-100 dark:bg-white/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                  🏭
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Staff Login</span>
                <span className="text-[10px] text-slate-500 mt-1">Run Analysis Only</span>
              </button>

              <button onClick={() => handleQuickLogin('lab_admin')} className="group flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/10 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-white/10 transition-all shadow-sm hover:border-blue-500/40 dark:hover:border-neon/40 backdrop-blur-md">
                <div className="w-12 h-12 mb-2 rounded-full bg-blue-100 dark:bg-white/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                  👩‍🔬
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Admin Login</span>
                <span className="text-[10px] text-slate-500 mt-1">Full DB Access</span>
              </button>
            </div>

            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Or continue with</span>
              <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
            </div>

            <form id="login-form" onSubmit={handleManualSubmit} className="space-y-6 mt-4">
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Floating Label Username Input */}
              <div className="relative group">
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="peer w-full px-5 pt-7 pb-3 rounded-2xl border border-slate-300 dark:border-white/15 bg-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-neon/50 focus:border-emerald-600 dark:focus:border-neon text-slate-900 dark:text-white transition-all shadow-sm dark:shadow-glass placeholder-transparent"
                  placeholder="Username"
                  autoComplete="username"
                  required
                />
                <label htmlFor="login-username" className="absolute left-5 top-3 text-xs font-bold text-slate-500 dark:text-slate-400 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-neon pointer-events-none">
                  Username or Staff ID
                </label>
              </div>

              {/* Floating Label Password Input */}
              <div className="relative group">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full px-5 pt-7 pb-3 pr-12 rounded-2xl border border-slate-300 dark:border-white/15 bg-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-neon/50 focus:border-emerald-600 dark:focus:border-neon text-slate-900 dark:text-white transition-all shadow-sm dark:shadow-glass placeholder-transparent"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
                <label htmlFor="login-password" className="absolute left-5 top-3 text-xs font-bold text-slate-500 dark:text-slate-400 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-neon pointer-events-none">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 dark:hover:text-neon transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <a href="#" className="font-bold text-sm text-emerald-600 dark:text-neon hover:underline transition-colors">Forgot password?</a>
              </div>

              <button
                id="login-submit"
                type="submit"
                className="btn-primary w-full py-5 text-xl mt-4 shadow-md dark:shadow-glow hover:scale-105"
              >
                Access Dashboard
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
