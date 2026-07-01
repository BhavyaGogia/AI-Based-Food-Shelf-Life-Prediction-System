import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage on mount
    const storedUser = sessionStorage.getItem('himshakti_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setRole(parsed.role);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch('http://localhost:5050/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (data.success) {
        setUser(data.data);
        setRole(data.data.role);
        setIsAuthenticated(true);
        sessionStorage.setItem('himshakti_user', JSON.stringify(data.data));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Server error during login' };
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5050/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('himshakti_user');
  };

  if (loading) return null; // Or a loading spinner

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
