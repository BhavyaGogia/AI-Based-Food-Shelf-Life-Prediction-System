import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow flex items-center justify-center relative overflow-hidden bg-forest-900">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Abstract glowing shapes */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-forest-500/20 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[150px]"></div>
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-forest-400/10 blur-[100px]"></div>
          
          {/* Grain overlay for texture */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}></div>
        </div>

        <div className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 py-16">
          
          {/* Left Side Typography/Branding */}
          <div className="hidden lg:flex flex-col justify-center px-8 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-8 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Secure Staff Portal
            </div>
            <h1 className="font-heading font-extrabold text-5xl xl:text-7xl leading-[1.1] mb-6 tracking-tight">
              Welcome to the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-300 to-emerald-200">
                Future of Food
              </span>
            </h1>
            <p className="text-forest-100/80 text-lg max-w-md leading-relaxed mb-12">
              Access the HimShakti AI dashboard to predict shelf life, manage ingredient quality, and optimize your production lines with absolute precision.
            </p>
            
            <div className="flex items-center gap-4 text-forest-200 text-sm font-medium">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-forest-900 bg-forest-600 flex items-center justify-center text-xs text-white">HS</div>
                <div className="w-10 h-10 rounded-full border-2 border-forest-900 bg-amber-600 flex items-center justify-center text-xs text-white">AI</div>
                <div className="w-10 h-10 rounded-full border-2 border-forest-900 bg-emerald-600 flex items-center justify-center text-xs text-white">Lab</div>
              </div>
              <p>Join our team of elite food scientists</p>
            </div>
          </div>

          {/* Right Side Login Card */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/20 p-8 sm:p-10 relative overflow-hidden transition-transform duration-500 hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.4)]">
              
              {/* Shine effect */}
              <div className="absolute top-0 left-[-100%] w-[200%] h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

              {/* Header */}
              <div className="mb-10 lg:hidden text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-white/20 shadow-inner">
                  🌾
                </div>
                <h2 className="font-heading font-bold text-3xl text-white">Staff Login</h2>
              </div>
              
              <div className="hidden lg:block mb-10 text-center lg:text-left">
                <h2 className="font-heading font-bold text-3xl text-white">Sign In</h2>
                <p className="text-white/60 mt-2">Enter your credentials to continue</p>
              </div>

              {/* Form */}
              <form id="login-form" onSubmit={(e) => e.preventDefault()} className="space-y-6">
                
                <div className="space-y-2">
                  <label htmlFor="login-username" className="block text-sm font-medium text-white/80">
                    Username or Staff ID
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-amber-400 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="login-username"
                      type="text"
                      placeholder="e.g. staff_01"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-black/20 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 text-white placeholder-white/30 transition-all backdrop-blur-sm"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className="block text-sm font-medium text-white/80">
                      Password
                    </label>
                    <a href="#" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-amber-400 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-black/20 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 text-white placeholder-white/30 transition-all backdrop-blur-sm"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  className="w-full mt-4 relative group overflow-hidden rounded-xl py-3.5 px-4 font-heading font-semibold text-forest-900 bg-amber-400 hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Access Dashboard
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </form>

            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  )
}
