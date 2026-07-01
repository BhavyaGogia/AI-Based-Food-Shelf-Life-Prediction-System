import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import UIShowcase from './pages/UIShowcase'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
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
          <Route path="/login" element={<Login />} />
          <Route path="/ui-showcase" element={<UIShowcase />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
