import React, { useState } from 'react';
import { apiService } from '../services/api';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleManualLogin = () => {
    apiService.auth.login();
  };

  const handleAutoLogin = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Manual auto-login button clicked');
      const response = await apiService.auth.autoLogin();
      console.log('✅ Manual auto-login successful:', response.data);
      // The useAuth hook will automatically detect the successful login
      window.location.reload();
    } catch (error: any) {
      console.error('❌ Manual auto-login failed:', error);
      console.log('Error response:', error.response?.data);
      alert(`Auto-login failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-moses-blue to-blue-800">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Moses AutoMall
          </h1>
          <h2 className="text-xl text-gray-600 mb-8">
            Internal Portal
          </h2>
          
          <div className="mb-8">
            <svg className="mx-auto h-24 w-24 text-moses-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
          
          <p className="text-gray-600 mb-6">
            Automatic Windows authentication failed. Please try one of the options below.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleAutoLogin}
              disabled={isLoading}
              className="w-full bg-moses-blue hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
              </svg>
              <span>{isLoading ? 'Authenticating...' : 'Try Windows Login Again'}</span>
            </button>
            
            <button
              onClick={handleManualLogin}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 0v12h12V4H4z" clipRule="evenodd" />
              </svg>
              <span>Sign in with Microsoft</span>
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            For internal use only. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
