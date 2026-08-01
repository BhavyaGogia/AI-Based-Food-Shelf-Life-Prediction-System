import { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE } from '../lib/api';

// Token helpers — stored in localStorage so it survives page refresh and
// is reliably sent through the Vite proxy (cookie forwarding is not guaranteed).
const getToken = () => localStorage.getItem('hs_token');
const saveToken = (t) => t ? localStorage.setItem('hs_token', t) : localStorage.removeItem('hs_token');

// Builds fetch options with Authorization header whenever a token is stored.
const authHeaders = (extra = {}) => {
  const token = getToken();
  return {
    credentials: 'include',
    ...extra,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(extra.headers || {})
    }
  };
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, authHeaders());
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setRole(data.data.role);
        setStatus(data.data.status);
        setIsAuthenticated(true);
        return data;
      } else {
        saveToken(null);
        setUser(null);
        setRole(null);
        setStatus(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Failed to restore session', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        saveToken(data.token);
        setUser(data.data);
        setRole(data.data.role);
        setStatus(data.data.status);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || data.errors?.[0]?.msg || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Server error during login' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        saveToken(data.token);
        setUser(data.data);
        setRole(data.data.role);
        setStatus(data.data.status);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || data.errors?.[0]?.msg || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Server error during registration' };
    }
  };

  const googleLogin = async (id_token) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id_token })
      });
      const data = await res.json();
      
      if (data.success) {
        saveToken(data.token);
        setUser(data.data);
        setRole(data.data.role);
        setStatus(data.data.status);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Google login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Server error during Google login' };
    }
  };

  const onboard = async (role) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/onboard`, authHeaders({
        method: 'PUT',
        body: JSON.stringify({ role })
      }));
      const data = await res.json();
      
      if (data.success) {
        setUser(data.data);
        setRole(data.data.role);
        setStatus(data.data.status);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Onboarding failed' };
      }
    } catch (error) {
      return { success: false, error: 'Server error during onboarding' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, authHeaders({ method: 'POST' }));
    } catch (e) {
      console.error(e);
    }
    saveToken(null);
    setUser(null);
    setRole(null);
    setStatus(null);
    setIsAuthenticated(false);
  };

  if (loading) return <div>Loading...</div>; // Or a loading spinner

  return (
    <AuthContext.Provider value={{ user, role, status, isAuthenticated, login, register, googleLogin, onboard, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
