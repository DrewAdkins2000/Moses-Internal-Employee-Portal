import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  department: string;
  roles: string[];
  lastLogin: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  pendingTraining: number;
  upcomingEvents: number;
  documentsAccessed: number;
}

const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'announcements'>('overview');

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        apiService.admin.getUsers(),
        apiService.admin.getStats()
      ]);
      
      setUsers((usersResponse.data as any).users);
      setStats((statsResponse.data as any).stats);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
              <p className="mt-2 text-sm text-red-700">
                You don't have permission to access the admin panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6">Loading admin panel...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-gray-600">
          Manage users, training assignments, and system settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'users', name: 'Users', icon: '👥' },
              { id: 'announcements', name: 'Announcements', icon: '📢' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab stats={stats} />
          )}
          {activeTab === 'users' && (
            <UsersTab users={users} onRefresh={fetchAdminData} />
          )}
          {activeTab === 'announcements' && (
            <AnnouncementsTab />
          )}
        </div>
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ stats: Stats | null }> = ({ stats }) => (
  <div className="space-y-6">
    <h2 className="text-lg font-semibold text-gray-900">System Overview</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" />
      <StatCard title="Active Users" value={stats?.activeUsers || 0} icon="✅" />
      <StatCard title="Pending Training" value={stats?.pendingTraining || 0} icon="📚" />
      <StatCard title="Upcoming Events" value={stats?.upcomingEvents || 0} icon="📅" />
      <StatCard title="Document Views" value={stats?.documentsAccessed || 0} icon="📄" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-green-400">✅</span>
            <span className="text-sm text-gray-300">John Doe completed Safety Training</span>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-blue-400">👤</span>
            <span className="text-sm text-gray-600">New user Jane Smith registered</span>
            <span className="text-xs text-gray-400">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-purple-500">📄</span>
            <span className="text-sm text-gray-600">Employee Handbook accessed 15 times</span>
            <span className="text-xs text-gray-400">Today</span>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="btn w-full text-left">
            📢 Create Announcement
          </button>
          <button className="btn w-full text-left">
            👥 Add New User
          </button>
          <button className="btn w-full text-left">
            📚 Assign Training
          </button>
        </div>
      </div>
    </div>
  </div>
);

const UsersTab: React.FC<{ users: User[]; onRefresh: () => void }> = ({ users, onRefresh }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">User Management</h2>
      <button
        onClick={onRefresh}
        className="btn btn-primary text-sm"
      >
        Refresh
      </button>
    </div>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-600">
        <thead className="bg-black bg-opacity-20">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Roles</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Login</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-gray-600">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white hover:bg-opacity-10">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {user.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-1">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-1 text-xs font-medium bg-blue-900 text-blue-200 rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {new Date(user.lastLogin).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                <button className="text-green-400 hover:text-green-300">Assign Training</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AnnouncementsTab: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.admin.createAnnouncement({
        title,
        content,
        targetUsers: 'all',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      });
      
      setTitle('');
      setContent('');
      alert('Announcement created successfully!');
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">Create Announcement</h2>
      
      <form onSubmit={handleCreateAnnouncement} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Enter announcement title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="form-input"
            placeholder="Enter announcement content"
            required
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
        >
          Create Announcement
        </button>
      </form>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="card p-6">
    <div className="flex items-center">
      <div className="p-2 bg-black bg-opacity-20 rounded-lg">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default AdminPanel;
