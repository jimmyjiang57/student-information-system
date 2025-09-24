import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('uiAuth');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.role) setRole(parsed.role);
        if (parsed.username) setUsername(parsed.username);
      }
    } catch (e) {
      console.warn('Failed to parse stored auth', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback((nextRole, nextUser) => {
    try {
      localStorage.setItem('uiAuth', JSON.stringify({ role: nextRole, username: nextUser }));
    } catch (e) {
      console.warn('Persist failed', e);
    }
  }, []);

  const login = useCallback((nextRole, nextUser) => {
    setRole(nextRole);
    setUsername(nextRole === 'student' ? nextUser : null);
    persist(nextRole, nextRole === 'student' ? nextUser : null);
  }, [persist]);

  const logout = useCallback(() => {
    setRole(null);
    setUsername(null);
    persist(null, null);
  }, [persist]);

  const value = { role, username, login, logout, loading, isInstructor: role === 'instructor', isStudent: role === 'student' };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
