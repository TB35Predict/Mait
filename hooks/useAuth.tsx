
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { adminLogin } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!sessionStorage.getItem('mait_admin_auth'));

  const login = async (password: string) => {
    const success = await adminLogin(password);
    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('mait_admin_auth', 'true');
    }
    return success;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('mait_admin_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
