import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Login() {
  const mainRef = useRef(null)

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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-body">
      <Navbar />

      <main className="flex-grow flex relative overflow-hidden pt-24" ref={mainRef}>
        
        {/* Left Side: Brand Story (Gradient Split) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-200 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 p-20 flex-col justify-center text-slate-900 dark:text-white overflow-hidden border-r border-slate-200 dark:border-white/10 transition-colors duration-500">
          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-neon/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-violet/10 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-lg reveal-left">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 dark:bg-white/5 border border-emerald-500/20 dark:border-white/15 text-emerald-700 dark:text-neon text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-[30px] shadow-sm dark:shadow-glow">
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
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 bg-white dark:bg-dark-950 relative z-10 transition-colors duration-500">
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

            {/* Social Auth Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="flex items-center justify-center gap-3 px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm font-bold text-slate-800 dark:text-slate-200 hover:border-emerald-500/40 dark:hover:border-neon/40">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-3 px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm font-bold text-slate-800 dark:text-slate-200 hover:border-emerald-500/40 dark:hover:border-neon/40">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                GitHub
              </button>
            </div>

            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Or continue with</span>
              <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
            </div>

            <form id="login-form" onSubmit={(e) => e.preventDefault()} className="space-y-6 mt-4">
              
              {/* Floating Label Username Input */}
              <div className="relative group">
                <input
                  id="login-username"
                  type="text"
                  className="peer w-full px-5 pt-7 pb-3 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-neon/50 focus:border-emerald-600 dark:focus:border-neon text-slate-900 dark:text-white transition-all shadow-sm dark:shadow-glass placeholder-transparent"
                  placeholder="Username"
                  autoComplete="username"
                />
                <label htmlFor="login-username" className="absolute left-5 top-3 text-xs font-bold text-slate-500 dark:text-slate-400 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-neon pointer-events-none">
                  Username or Staff ID
                </label>
              </div>

              {/* Floating Label Password Input */}
              <div className="relative group">
                <input
                  id="login-password"
                  type="password"
                  className="peer w-full px-5 pt-7 pb-3 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-neon/50 focus:border-emerald-600 dark:focus:border-neon text-slate-900 dark:text-white transition-all shadow-sm dark:shadow-glass placeholder-transparent"
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <label htmlFor="login-password" className="absolute left-5 top-3 text-xs font-bold text-slate-500 dark:text-slate-400 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-neon pointer-events-none">
                  Password
                </label>
                <div className="absolute right-5 top-5 text-sm">
                  <a href="#" className="font-bold text-emerald-600 dark:text-neon hover:underline transition-colors">Forgot password?</a>
                </div>
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
