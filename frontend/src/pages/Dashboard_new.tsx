import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch training progress
      const trainingResponse = await apiService.training.getProgress();
      setStats(trainingResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="card">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening at Moses AutoMall today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-moses-light rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="stat-title">Training Progress</p>
              <p className="stat-value">50%</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-moses-light rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="stat-title">Completed Trainings</p>
              <p className="stat-value">1</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-moses-light rounded-lg">
              <span className="text-2xl">⏰</span>
            </div>
            <div className="ml-4">
              <p className="stat-title">Pending Required</p>
              <p className="stat-value">1</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-moses-light rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="stat-title">Upcoming Events</p>
              <p className="stat-value">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
        <QuickActionTile
          title="Email"
          description="Access Outlook Web App"
          icon="✉️"
          href="https://outlook.office.com"
          external
        />
        
        <QuickActionTile
          title="Training Center"
          description="Complete required training modules"
          icon="📚"
          href="/training"
        />
        
        <QuickActionTile
          title="Company Events"
          description="View and RSVP to upcoming events"
          icon="📅"
          href="/events"
        />
        
        <QuickActionTile
          title="Documents"
          description="Access company documents and files"
          icon="📁"
          href="/documents"
        />
        
        <QuickActionTile
          title="Employee Directory"
          description="Find contact information"
          icon="👥"
          href="/directory"
        />
        
        <QuickActionTile
          title="Help Desk"
          description="Submit IT support requests"
          icon="🛠️"
          href="/support"
        />
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
            <span className="text-lg">✅</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Completed: Safety Training Module</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
            <span className="text-lg">📅</span>
            <div>
              <p className="text-sm font-medium text-gray-900">RSVP'd to: Team Meeting</p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
            <span className="text-lg">📁</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Downloaded: Employee Handbook</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Action Tile Component
interface QuickActionTileProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  external?: boolean;
}

const QuickActionTile: React.FC<QuickActionTileProps> = ({ 
  title, 
  description, 
  icon, 
  href, 
  external = false 
}) => {
  const content = (
    <div className="card hover:bg-gray-50 transition cursor-pointer">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-moses-light rounded-lg">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );

  if (external) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return (
    <a href={href} className="block">
      {content}
    </a>
  );
};

export default Dashboard;
