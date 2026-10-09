import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, FreelancerProfile, BusinessProfile, UserRole } from '@skillbridge/shared';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: FreelancerProfile | BusinessProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: 'freelancer' | 'business' }) => Promise<void>;
  logout: () => void;
  quickLoginAs: (role: 'business' | 'freelancer' | 'admin') => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FreelancerProfile | BusinessProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sb_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (!localStorage.getItem('sb_token')) {
        setIsLoading(false);
        return;
      }
      const res = await api.getMe();
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    if (res.success) {
      localStorage.setItem('sb_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
    }
  };

  const register = async (data: { name: string; email: string; password: string; role: 'freelancer' | 'business' }) => {
    const res = await api.register(data);
    if (res.success) {
      localStorage.setItem('sb_token', res.token);
      setToken(res.token);
      setUser(res.user);
      await refreshMe();
    }
  };

  const logout = () => {
    localStorage.removeItem('sb_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const quickLoginAs = async (role: 'business' | 'freelancer' | 'admin') => {
    setIsLoading(true);
    let email = 'client@skillbridge.io';
    let pass = 'Password123!';

    if (role === 'freelancer') {
      email = 'sarah@skillbridge.io';
    } else if (role === 'admin') {
      email = 'admin@skillbridge.io';
      pass = 'AdminSecret2026!';
    }

    try {
      await login(email, pass);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMe = async () => {
    try {
      const res = await api.getMe();
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
      }
    } catch (err) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        login,
        register,
        logout,
        quickLoginAs,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
