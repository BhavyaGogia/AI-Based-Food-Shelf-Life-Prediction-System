import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CosmicCanvas from '../components/CosmicCanvas';

export default function Onboarding() {
  const { user, role, onboard, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthenticated) {
      navigate('/login');
    }
    // Redirect if role is already assigned
    if (role && role !== 'unassigned') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a role to proceed');
      return;
    }
    setLoading(true);
    setError('');

    const res = await onboard(selectedRole);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Failed to update role');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-500 font-body">
      <CosmicCanvas />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-neon/5 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-violet/5 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="w-full max-w-xl bg-white/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl transition-all">
          <div className="text-center mb-8">
            <h2 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">Complete Profile Setup</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-md">Welcome, {user?.username}! Select your operational role to access the workspace.</p>
          </div>

          {error && (
            <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Production Staff Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('production_staff')}
                className={`group text-left p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-md relative ${
                  selectedRole === 'production_staff'
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-glow'
                    : 'border-slate-200 dark:border-white/10 bg-white/10 dark:bg-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                }`}
              >
                <div className="w-12 h-12 mb-4 rounded-full bg-emerald-100 dark:bg-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🏭
                </div>
                <h4 className="font-bold text-lg text-slate-950 dark:text-white">Production Staff</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-medium">Record scan events, log basic quality audits, and run standard predictions.</p>
              </button>

              {/* Warehouse Supervisor Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('warehouse_supervisor')}
                className={`group text-left p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-md relative ${
                  selectedRole === 'warehouse_supervisor'
                    ? 'border-amber-500 bg-amber-500/10 shadow-glow'
                    : 'border-slate-200 dark:border-white/10 bg-white/10 dark:bg-white/5 hover:border-amber-500/50 hover:bg-amber-500/5'
                }`}
              >
                <div className="w-12 h-12 mb-4 rounded-full bg-amber-100 dark:bg-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📦
                </div>
                <h4 className="font-bold text-lg text-slate-950 dark:text-white">Warehouse Supervisor</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-medium">Manage stock inventory, track batch storage locations, and monitor expiry timetables.</p>
              </button>

              {/* Lab Admin Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('lab_admin')}
                className={`group text-left p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-md relative ${
                  selectedRole === 'lab_admin'
                    ? 'border-blue-500 bg-blue-500/10 shadow-glow'
                    : 'border-slate-200 dark:border-white/10 bg-white/10 dark:bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/5'
                }`}
              >
                <div className="w-12 h-12 mb-4 rounded-full bg-blue-100 dark:bg-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  👩‍🔬
                </div>
                <h4 className="font-bold text-lg text-slate-950 dark:text-white">Lab Administrator</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-medium">Access database, manage product templates, calibrate testing algorithms, and edit metadata.</p>
              </button>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-xl shadow-md dark:shadow-glow hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Setting up workspace...' : 'Confirm Role & Enter'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
