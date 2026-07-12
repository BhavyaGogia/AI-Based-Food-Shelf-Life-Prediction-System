import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CosmicCanvas from '../components/CosmicCanvas';

export default function PendingApproval() {
  const { user, status, isAuthenticated, logout, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (status === 'active' && user?.role !== 'unassigned') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, status, user, navigate]);

  const handleCheckStatus = async () => {
    setChecking(true);
    setMessage('');
    try {
      console.log('Checking status...');
      const data = await checkAuth();
      console.log('Check status response:', data);
      if (data?.success) {
        if (data.data.status === 'active' && data.data.role !== 'unassigned') {
          setMessage('Approved! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          setMessage('Status: Still pending approval.');
        }
      } else {
        setMessage('Could not retrieve status. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error checking status.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-100 font-body">
      <CosmicCanvas />
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-24 px-4 relative z-10">
        <div className="w-full max-w-md bg-white/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center text-4xl animate-pulse">
            ⏳
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mb-2">
            Access Request Submitted
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            Your request to join as <strong>{user?.requestedRole?.replace('_', ' ').toUpperCase()}</strong> is currently under review by an administrator. You will gain access once approved.
          </p>

          {message && (
            <div className="p-3 mb-4 bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-emerald-400">
              {message}
            </div>
          )}

          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full py-3 mb-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-colors font-medium text-slate-800 dark:text-white disabled:opacity-50"
          >
            {checking ? 'Checking...' : 'Check Status Again'}
          </button>
          <button
            onClick={logout}
            className="w-full py-3 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl transition-colors hover:bg-red-500/10 font-medium"
          >
            Sign Out
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
