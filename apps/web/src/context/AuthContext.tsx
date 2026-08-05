import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, setAccessToken } from '../api/client';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const { data: refreshData } = await apiClient.post('/auth/refresh-token');
        setAccessToken(refreshData.accessToken);

        const { data: meData } = await apiClient.get('/auth/me');
        setUser(meData.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(email: string, password: string) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function register(input: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) {
    const { data } = await apiClient.post('/auth/register', input);
    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function logout() {
    await apiClient.post('/auth/logout');
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}