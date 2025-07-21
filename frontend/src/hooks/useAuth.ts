import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      console.log('🔍 Checking authentication status...');
      
      // First check if already authenticated
      try {
        console.log('📋 Checking existing session...');
        const response = await apiService.auth.getMe();
        console.log('✅ Existing session found:', response.data);
        setUser((response.data as any).user);
        setError(null);
        return;
      } catch (authErr: any) {
        console.log('❌ No existing session, attempting auto-login...');
        
        // If not authenticated, try auto-login with Windows credentials
        if (authErr.response?.status === 401) {
          try {
            console.log('🔄 Attempting Windows auto-login...');
            const autoLoginResponse = await apiService.auth.autoLogin();
            console.log('✅ Auto-login successful:', autoLoginResponse.data);
            setUser((autoLoginResponse.data as any).user);
            setError(null);
            return;
          } catch (autoLoginErr: any) {
            console.warn('❌ Auto-login failed:', autoLoginErr);
            console.log('Response data:', autoLoginErr.response?.data);
          }
        }
        
        // If both attempts fail, user needs manual authentication
        setUser(null);
        if (authErr.response?.status !== 401) {
          setError('Failed to check authentication status');
        }
      }
    } catch (err: any) {
      console.error('💥 Authentication error:', err);
      setError('Authentication system error');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    apiService.auth.login();
  };

  const logout = async () => {
    try {
      await apiService.auth.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isAuthenticated = !!user;
  const hasRole = (role: string) => user?.roles.includes(role) || false;
  const isAdmin = hasRole('Admin');
  const isManager = hasRole('Manager');

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isAdmin,
    isManager,
    refreshAuth: checkAuthStatus,
  };
};
