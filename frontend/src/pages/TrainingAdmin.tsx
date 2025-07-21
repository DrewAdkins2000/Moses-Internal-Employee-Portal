import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'admin' | 'manager' | 'employee';
  joinDate: string;
}

interface TrainingAssignment {
  id: string;
  trainingId: string;
  userId: string;
  assignedBy: string;
  assignedDate: string;
  dueDate: string;
  customInstructions?: string;
  reminderSchedule: string[];
  status: 'assigned' | 'started' | 'completed' | 'overdue';
}

interface TrainingTemplate {
  id: string;
  title: string;
  description: string;
  category: 'IT_SECURITY' | 'HUMAN_RESOURCES' | 'COMPLIANCE' | 'SAFETY' | 'GENERAL';
  type: 'internal_video_quiz' | 'external_link' | 'document_review' | 'webinar' | 'hands_on' | 'certification';
  estimatedDuration: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

const TrainingAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assign' | 'manage' | 'create' | 'reports'>('assign');
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<TrainingAssignment[]>([]);
  const [templates, setTemplates] = useState<TrainingTemplate[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<string>('');
  const [customDueDate, setCustomDueDate] = useState<string>('');
  const [assignmentNote, setAssignmentNote] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@mosesautonet.com',
      department: 'Sales',
      role: 'employee',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@mosesautonet.com',
      department: 'Finance',
      role: 'manager',
      joinDate: '2023-06-10'
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@mosesautonet.com',
      department: 'Service',
      role: 'employee',
      joinDate: '2024-03-20'
    },
    {
      id: '4',
      name: 'Lisa Chen',
      email: 'lisa.chen@mosesautonet.com',
      department: 'Human Resources',
      role: 'manager',
      joinDate: '2022-11-05'
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david.wilson@mosesautonet.com',
      department: 'IT',
      role: 'employee',
      joinDate: '2024-02-12'
    }
  ];

  const mockTemplates: TrainingTemplate[] = [
    {
      id: 'template-1',
      title: 'Advanced Cybersecurity Awareness',
      description: 'Comprehensive cybersecurity training covering phishing, social engineering, and data protection.',
      category: 'IT_SECURITY',
      type: 'internal_video_quiz',
      estimatedDuration: 45,
      isActive: true,
      createdBy: 'IT Security Team',
      createdDate: '2025-01-15',
      lastModified: '2025-07-01'
    },
    {
      id: 'template-2',
      title: 'Workplace Harassment Prevention',
      description: 'Mandatory training on preventing workplace harassment and creating inclusive environments.',
      category: 'HUMAN_RESOURCES',
      type: 'internal_video_quiz',
      estimatedDuration: 30,
      isActive: true,
      createdBy: 'HR Director',
      createdDate: '2025-02-01',
      lastModified: '2025-06-15'
    },
    {
      id: 'template-3',
      title: 'OSHA Safety Certification',
      description: 'External OSHA certification program for workplace safety compliance.',
      category: 'SAFETY',
      type: 'external_link',
      estimatedDuration: 240,
      isActive: true,
      createdBy: 'Safety Officer',
      createdDate: '2025-03-10',
      lastModified: '2025-07-10'
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
    setTemplates(mockTemplates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAssignTraining = () => {
    if (!selectedTraining || selectedUsers.length === 0 || !customDueDate) {
      alert('Please select training, users, and due date.');
      return;
    }

    const newAssignments = selectedUsers.map(userId => ({
      id: `assignment-${Date.now()}-${userId}`,
      trainingId: selectedTraining,
      userId,
      assignedBy: 'Current Admin', // Would be from auth context
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: customDueDate,
      customInstructions: assignmentNote,
      reminderSchedule: ['7', '3', '1'], // Days before due date
      status: 'assigned' as const
    }));

    setAssignments(prev => [...prev, ...newAssignments]);
    
    // Reset form
    setSelectedUsers([]);
    setSelectedTraining('');
    setCustomDueDate('');
    setAssignmentNote('');
    
    alert(`Successfully assigned training to ${selectedUsers.length} user(s).`);
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = filterDepartment === 'all' 
    ? users 
    : users.filter(user => user.department === filterDepartment);

  const departments = Array.from(new Set(users.map(user => user.department)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Training Administration</h1>
        <p className="text-gray-300">
          Manage training assignments, create new courses, and monitor completion progress.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-gray-600">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('assign')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'assign'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              📋 Assign Training
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'manage'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              📊 Manage Assignments
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              ➕ Create Training
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              📈 Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Assign Training Tab */}
          {activeTab === 'assign' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">Assign Training to Users</h2>
              
              {/* Training Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Training
                  </label>
                  <select
                    value={selectedTraining}
                    onChange={(e) => setSelectedTraining(e.target.value)}
                    className="form-input w-full"
                  >
                    <option value="">Choose a training...</option>
                    {templates.filter(t => t.isActive).map(template => (
                      <option key={template.id} value={template.id}>
                        {template.title} ({template.category.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={customDueDate}
                    onChange={(e) => setCustomDueDate(e.target.value)}
                    className="form-input w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Assignment Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Instructions (Optional)
                </label>
                <textarea
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  className="form-input w-full h-24 resize-none"
                  placeholder="Add any special instructions for this training assignment..."
                />
              </div>

              {/* User Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Select Users</h3>
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-300">Filter by Department:</label>
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="form-input"
                    >
                      <option value="all">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <div key={user.id} className="flex items-center space-x-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelection(user.id)}
                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">
                          {user.email} • {user.department} • {user.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedUsers.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                    <div className="text-sm text-blue-200">
                      Selected {selectedUsers.length} user(s) for training assignment
                    </div>
                  </div>
                )}
              </div>

              {/* Assign Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleAssignTraining}
                  disabled={!selectedTraining || selectedUsers.length === 0 || !customDueDate}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign Training to {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}

          {/* Manage Assignments Tab */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">Training Assignments</h2>
              
              {assignments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">📋</div>
                  <p className="text-gray-400">No training assignments yet. Create some assignments in the "Assign Training" tab.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-300">User</th>
                        <th className="text-left p-4 text-gray-300">Training</th>
                        <th className="text-left p-4 text-gray-300">Assigned Date</th>
                        <th className="text-left p-4 text-gray-300">Due Date</th>
                        <th className="text-left p-4 text-gray-300">Status</th>
                        <th className="text-left p-4 text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map(assignment => {
                        const user = users.find(u => u.id === assignment.userId);
                        const training = templates.find(t => t.id === assignment.trainingId);
                        return (
                          <tr key={assignment.id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                            <td className="p-4">
                              <div className="font-medium text-white">{user?.name}</div>
                              <div className="text-xs text-gray-400">{user?.department}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-white">{training?.title}</div>
                              <div className="text-xs text-gray-400">{training?.category.replace('_', ' ')}</div>
                            </td>
                            <td className="p-4 text-gray-300">
                              {new Date(assignment.assignedDate).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-gray-300">
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                assignment.status === 'completed' ? 'bg-green-900 text-green-200' :
                                assignment.status === 'overdue' ? 'bg-red-900 text-red-200' :
                                assignment.status === 'started' ? 'bg-yellow-900 text-yellow-200' :
                                'bg-gray-700 text-gray-300'
                              }`}>
                                {assignment.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <button className="btn-primary px-3 py-1 text-xs rounded">
                                  Send Reminder
                                </button>
                                <button className="btn-danger px-3 py-1 text-xs rounded">
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Create Training Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">Create New Training</h2>
              <CreateTrainingForm onSave={(template) => setTemplates(prev => [...prev, template])} />
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">Training Reports & Analytics</h2>
              <TrainingReports assignments={assignments} users={users} templates={templates} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Training Form Component
interface CreateTrainingFormProps {
  onSave: (template: TrainingTemplate) => void;
}

const CreateTrainingForm: React.FC<CreateTrainingFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GENERAL' as TrainingTemplate['category'],
    type: 'internal_video_quiz' as TrainingTemplate['type'],
    estimatedDuration: 30,
    externalUrl: '',
    videoUrl: '',
    quizUrl: '',
    documents: [] as any[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTemplate: TrainingTemplate = {
      id: `template-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      estimatedDuration: formData.estimatedDuration,
      isActive: true,
      createdBy: 'Current Admin',
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };

    onSave(newTemplate);
    alert('Training template created successfully!');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'GENERAL',
      type: 'internal_video_quiz',
      estimatedDuration: 30,
      externalUrl: '',
      videoUrl: '',
      quizUrl: '',
      documents: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Training Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="form-input w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
            className="form-input w-full"
            required
          >
            <option value="GENERAL">📚 General</option>
            <option value="IT_SECURITY">🔒 IT Security</option>
            <option value="HUMAN_RESOURCES">👥 Human Resources</option>
            <option value="COMPLIANCE">📋 Compliance</option>
            <option value="SAFETY">🚨 Safety</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="form-input w-full h-24 resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Training Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
            className="form-input w-full"
            required
          >
            <option value="internal_video_quiz">🎥 Internal Video + Quiz</option>
            <option value="external_link">🔗 External Link</option>
            <option value="document_review">📄 Document Review</option>
            <option value="webinar">🎤 Webinar</option>
            <option value="hands_on">👷 Hands-on Training</option>
            <option value="certification">🏆 Certification</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Estimated Duration (minutes) *
          </label>
          <input
            type="number"
            value={formData.estimatedDuration}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
            className="form-input w-full"
            min="1"
            required
          />
        </div>
      </div>

      {/* Conditional fields based on training type */}
      {(formData.type === 'external_link' || formData.type === 'webinar') && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            External URL *
          </label>
          <input
            type="url"
            value={formData.externalUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
            className="form-input w-full"
            placeholder="https://example.com/training"
            required
          />
        </div>
      )}

      {formData.type === 'internal_video_quiz' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video URL
            </label>
            <input
              type="text"
              value={formData.videoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
              className="form-input w-full"
              placeholder="/training/videos/my-video.mp4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quiz URL
            </label>
            <input
              type="text"
              value={formData.quizUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, quizUrl: e.target.value }))}
              className="form-input w-full"
              placeholder="/training/quizzes/my-quiz"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button type="button" className="btn">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Create Training
        </button>
      </div>
    </form>
  );
};

// Training Reports Component
interface TrainingReportsProps {
  assignments: TrainingAssignment[];
  users: User[];
  templates: TrainingTemplate[];
}

const TrainingReports: React.FC<TrainingReportsProps> = ({ assignments, users, templates }) => {
  const completionRate = assignments.length > 0 
    ? Math.round((assignments.filter(a => a.status === 'completed').length / assignments.length) * 100)
    : 0;

  const overdueCount = assignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    const now = new Date();
    return dueDate < now && a.status !== 'completed';
  }).length;

  const departmentStats = users.reduce((stats, user) => {
    const userAssignments = assignments.filter(a => a.userId === user.id);
    const completed = userAssignments.filter(a => a.status === 'completed').length;
    
    if (!stats[user.department]) {
      stats[user.department] = { total: 0, completed: 0 };
    }
    stats[user.department].total += userAssignments.length;
    stats[user.department].completed += completed;
    
    return stats;
  }, {} as Record<string, { total: number; completed: number }>);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center p-4 bg-gray-700/30 rounded-lg">
          <div className="text-3xl font-bold text-blue-400">{assignments.length}</div>
          <div className="text-sm text-gray-300">Total Assignments</div>
        </div>
        <div className="text-center p-4 bg-gray-700/30 rounded-lg">
          <div className="text-3xl font-bold text-green-400">{completionRate}%</div>
          <div className="text-sm text-gray-300">Completion Rate</div>
        </div>
        <div className="text-center p-4 bg-gray-700/30 rounded-lg">
          <div className="text-3xl font-bold text-red-400">{overdueCount}</div>
          <div className="text-sm text-gray-300">Overdue</div>
        </div>
        <div className="text-center p-4 bg-gray-700/30 rounded-lg">
          <div className="text-3xl font-bold text-purple-400">{templates.length}</div>
          <div className="text-sm text-gray-300">Active Templates</div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-gray-800/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Department Performance</h3>
        {Object.entries(departmentStats).map(([dept, stats]) => (
          <div key={dept} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{dept}</span>
              <span className="text-gray-300 text-sm">
                {stats.completed}/{stats.total} ({stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%)
              </span>
            </div>
            <div className="bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Export Options */}
      <div className="flex space-x-4">
        <button className="btn btn-primary">
          📊 Export to Excel
        </button>
        <button className="btn">
          📄 Generate PDF Report
        </button>
        <button className="btn">
          📧 Email Summary
        </button>
      </div>
    </div>
  );
};

export default TrainingAdmin;
