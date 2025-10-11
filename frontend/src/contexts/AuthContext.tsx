import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Simple User interface without backend
interface User {
  id: string;
  name: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
}

// Authentication Context Interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  error: string | null;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alpha Asimov Robotics User',
    fullName: 'Alpha Asimov Robotics User',
    email: 'demo@example.com',
    phone: '0123456789',
    role: 'Alpha Asimov Robotics'
  }
];

// AuthProvider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Mock login function
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists in mock data or create a demo user
      let foundUser: User | undefined = MOCK_USERS.find(u => u.email === email);
      
      // In a real app, we would validate the password here
      console.log('Login attempt with password:', password);
      
      if (!foundUser) {
        // Create a demo user for any email
        foundUser = {
          id: Date.now().toString(),
          name: 'Alpha Asimov Robotics User',
          fullName: 'Alpha Asimov Robotics User',
          email: email,
          phone: '0123456789',
          role: 'Alpha Asimov Robotics'
        };
      }

      // Save to localStorage
      if (foundUser) {
        localStorage.setItem('auth_user', JSON.stringify(foundUser));
        setUser(foundUser);
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        fullName: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: 'Alpha Asimov Robotics'
      };

      // Save to localStorage
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('auth_user');
    setUser(null);
    setError(null);
  };

  // Clear error function
  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    clearError,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export types
export type { User };
