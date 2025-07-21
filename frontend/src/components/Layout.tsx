import React, { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
  user: any;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="backdrop-filter backdrop-blur-lg border-b border-white border-opacity-10 shadow-lg" style={{
        background: 'linear-gradient(90deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}>
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-28 relative">
            {/* Logo - Far Left */}
            <div className="flex items-center" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
              <img 
                src="/Logo.png" 
                alt="Moses AutoMall Logo" 
                className="h-24 w-24"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
            
            {/* Title - Center */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold text-white">
                Internal Employee Portal
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <Navigation user={user} />
        
        {/* Main Content */}
        <main className="flex-1 p-6 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
