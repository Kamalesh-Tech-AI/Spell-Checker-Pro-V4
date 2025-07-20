import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User, AuthState, LoginCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@autospell.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: '3',
    email: 'sarah@example.com',
    name: 'Sarah Wilson',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2024-12-20T10:30:00Z'
  },
  {
    id: '4',
    email: 'mike@example.com',
    name: 'Mike Johnson',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    createdAt: '2024-02-10T00:00:00Z',
    lastLogin: '2024-12-19T15:45:00Z'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = Cookies.get('autospell_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        Cookies.remove('autospell_user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = MOCK_USERS.find(u => u.email === credentials.email);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Mock password validation (in real app, this would be handled by backend)
      const validPasswords: Record<string, string> = {
        'admin@autospell.com': 'admin123',
        'user@example.com': 'user123',
        'sarah@example.com': 'sarah123',
        'mike@example.com': 'mike123'
      };

      if (validPasswords[credentials.email] !== credentials.password) {
        return { success: false, error: 'Invalid password' };
      }

      // Update last login
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };

      // Save to cookie (expires in 7 days)
      Cookies.set('autospell_user', JSON.stringify(updatedUser), { expires: 7 });

      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const loginWithGoogle = async (credential: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would decode the JWT credential and validate it
      // For now, we'll create a mock user based on the credential
      const mockGoogleUser: User = {
        id: 'google_' + Math.random().toString(36).substr(2, 9),
        email: 'google.user@gmail.com',
        name: 'Google User',
        role: 'user',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save to cookie (expires in 7 days)
      Cookies.set('autospell_user', JSON.stringify(mockGoogleUser), { expires: 7 });

      setAuthState({
        user: mockGoogleUser,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Google login failed. Please try again.' };
    }
  };

  const logout = () => {
    Cookies.remove('autospell_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      loginWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};