import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    if (token && user) {
      setAdmin({ token, username: user });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await API.post('/auth/login', { username, password });
    const { token, username: uname } = res.data;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', uname);
    setAdmin({ token, username: uname });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
