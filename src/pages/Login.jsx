import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-10">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🔐
              </div>
              <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">Staff Login</h1>
              <p className="text-gray-500 text-sm mt-2">
                Sign in to access the HimShakti Shelf Life Predictor
              </p>
            </div>

            {/* Form (placeholder — no logic in Week 2) */}
            <form id="login-form" onSubmit={(e) => e.preventDefault()} className="space-y-5">

              <div>
                <label
                  htmlFor="login-username"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Username / Staff ID
                </label>
                <input
                  id="login-username"
                  type="text"
                  placeholder="e.g., staff_01"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                  autoComplete="current-password"
                />
              </div>

              <button
                id="login-submit"
                type="submit"
                className="w-full btn-primary flex items-center justify-center gap-2 py-3.5"
              >
                <span>🌾</span>
                Sign In
              </button>
            </form>

            {/* Placeholder notice */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
              <p className="text-amber-700 text-xs font-medium">
                ⏳ Authentication logic will be added in a future week.
                This form is a UI placeholder for Week 2.
              </p>
            </div>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            HimShakti Food Processing · TBI-GEU Internship 2026
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
