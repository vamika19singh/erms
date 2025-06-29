import React, { createContext, useContext, useState, ReactNode } from 'react';
import api, { setAuthToken } from '../api';

interface AuthContextType {
  token: string | null;
  role: 'engineer' | 'manager' | null;
  name: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'engineer' | 'manager' | null>(null);
  const [name, setName] = useState<string | null>(null);

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    setToken(response.data.token);
    setRole(response.data.role);
    setName(response.data.name);
    setAuthToken(response.data.token);
  }

  function logout() {
    setToken(null);
    setRole(null);
    setName(null);
    setAuthToken(null);
  }

  const value = { token, role, name, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}