import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { DEMO_USERS } from '../data/initialData';

interface AuthContextType {
  user: UserProfile | null;
  role: 'customer' | 'admin';
  isAdmin: boolean;
  login: (email: string, role?: 'customer' | 'admin') => void;
  register: (name: string, email: string, phone: string) => void;
  logout: () => void;
  switchRole: (newRole: 'customer' | 'admin') => void;
  updateBalance: (delta: number) => void;
  setBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'souq_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    // Default to customer demo user
    return DEMO_USERS[0];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, role: 'customer' | 'admin' = 'customer') => {
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
    } else {
      const newUser: UserProfile = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email,
        phone: '01000000000',
        role,
        balance: 500,
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
    }
  };

  const register = (name: string, email: string, phone: string) => {
    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      name,
      email,
      phone,
      role: 'customer',
      balance: 100, // Welcome gift 100 EGP
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
  };

  const logout = () => {
    // Reset to customer demo user for smooth browsing
    setUser(DEMO_USERS[0]);
  };

  const switchRole = (newRole: 'customer' | 'admin') => {
    if (newRole === 'admin') {
      const admin = DEMO_USERS.find(u => u.role === 'admin') || DEMO_USERS[1];
      setUser(admin);
    } else {
      const customer = DEMO_USERS.find(u => u.role === 'customer') || DEMO_USERS[0];
      setUser(customer);
    }
  };

  const updateBalance = (delta: number) => {
    setUser(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance + delta)
    }));
  };

  const setBalance = (newBalance: number) => {
    setUser(prev => ({
      ...prev,
      balance: Math.max(0, newBalance)
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        isAdmin: user.role === 'admin',
        login,
        register,
        logout,
        switchRole,
        updateBalance,
        setBalance
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
