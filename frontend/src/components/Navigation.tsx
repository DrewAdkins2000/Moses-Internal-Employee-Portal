import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  user: any;
}

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Training Center', href: '/training', icon: '📚' },
    { name: 'Events', href: '/events', icon: '📅' },
    { name: 'Documents', href: '/documents', icon: '📁' },
    { name: 'Email', href: 'https://outlook.office.com', icon: '✉️', external: true },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Training Admin', href: '/training-admin', icon: '🎓' });
    navItems.push({ name: 'Admin Panel', href: '/admin', icon: '⚙️' });
  }

  return (
    <nav className="w-64 bg-gradient-secondary backdrop-filter backdrop-blur-lg border-r border-white border-opacity-10 min-h-screen shadow-lg" style={{
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
      boxShadow: 'inset 2px 0 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.05)'
    }}>
      <div className="p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6 opacity-90">
          Navigation
        </h2>
        
        <div className="space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn block text-center mb-2 text-white"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                    <svg className="h-4 w-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              );
            }
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`btn block text-center mb-2 ${
                  isActive
                    ? 'bg-white bg-opacity-20 text-white font-semibold shadow-lg backdrop-filter backdrop-blur-sm'
                    : 'text-white'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 p-4 bg-black bg-opacity-20 rounded-lg backdrop-filter backdrop-blur-sm border border-white border-opacity-10">
          <p className="text-xs text-white opacity-90">
            <strong className="text-white">Logged in as:</strong><br />
            <span className="text-gray-300">{user?.email}</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            <strong>Role:</strong> {user?.roles?.join(', ') || 'Employee'}
          </p>
          
          {/* Sign Out Button */}
          <button
            onClick={logout}
            className="btn btn-danger w-full mt-4 text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
