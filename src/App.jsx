import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import UIShowcase from './pages/UIShowcase'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import PendingApproval from './pages/PendingApproval'
import AdminPanel from './pages/AdminPanel'
import ErrorBoundary from './components/ErrorBoundary'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, role, status } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (status === 'suspended' || status === 'rejected') {
    return <Navigate to="/login" replace />;
  }
  if (status === 'pending_approval') {
    return <Navigate to="/pending" replace />;
  }
  if (role === 'unassigned') {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

// Use the actual Google Client ID. (Client IDs are public and safe to expose in frontend code)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '687969027894-a40qa6v1nv2cms1a9v075dip28ukmsvk.apps.googleusercontent.com';

export default function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/pending" element={<PendingApproval />} />
              <Route path="/login" element={<Login />} />
              <Route path="/ui-showcase" element={<UIShowcase />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  )
}
