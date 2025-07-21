import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Training {
  id: string;
  title: string;
  description: string;
  category: 'IT_SECURITY' | 'HUMAN_RESOURCES' | 'COMPLIANCE' | 'SAFETY' | 'GENERAL';
  subcategory?: string;
  type: 'internal_video_quiz' | 'external_link' | 'document_review' | 'webinar' | 'hands_on' | 'certification';
  isRequired: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue' | 'expired';
  assignedBy: string;
  assignedDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedDuration: number; // in minutes
  progress: number; // 0-100
  
  // Content-specific fields
  hasVideo: boolean;
  hasQuiz: boolean;
  hasDocuments: boolean;
  videoUrl?: string;
  quizUrl?: string;
  externalUrl?: string;
  documents?: TrainingDocument[];
  
  // Tracking and scoring
  attempts: number;
  maxAttempts: number;
  passingScore: number;
  lastScore?: number;
  bestScore?: number;
  
  // Prerequisites and dependencies
  prerequisites: string[]; // Training IDs that must be completed first
  tags: string[];
  
  // Assignment details
  assignmentNote?: string;
  reminderSent: boolean;
  autoAssign: boolean; // For role-based auto assignments
}

interface TrainingDocument {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'ppt' | 'video' | 'link';
  isRequired: boolean;
}

interface TrainingProgress {
  totalAssigned: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionPercentage: number;
  totalTimeSpent: number;
  averageScore: number;
  certifications: number;
}

const TrainingCenter: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'IT_SECURITY' | 'HUMAN_RESOURCES' | 'COMPLIANCE' | 'SAFETY' | 'GENERAL'>('ALL');
  const [filterType, setFilterType] = useState<'all' | 'required' | 'overdue' | 'in_progress'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title' | 'assignedDate'>('dueDate');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Enhanced mock data for comprehensive LMS
  const mockTrainings: Training[] = [
    // IT Security & Compliance
    {
      id: '1',
      title: 'Advanced Cybersecurity Awareness',
      description: 'Comprehensive cybersecurity training covering phishing, social engineering, data protection, and incident response procedures.',
      category: 'IT_SECURITY',
      subcategory: 'Awareness Training',
      type: 'internal_video_quiz',
      isRequired: true,
      priority: 'critical',
      status: 'not_started',
      assignedBy: 'IT Security Team',
      assignedDate: '2025-07-01',
      dueDate: '2025-08-15',
      estimatedDuration: 45,
      progress: 0,
      hasVideo: true,
      hasQuiz: true,
      hasDocuments: true,
      videoUrl: '/training/videos/cybersecurity-advanced.mp4',
      quizUrl: '/training/quizzes/cybersecurity-advanced',
      documents: [
        {
          id: 'doc1',
          name: 'Cybersecurity Policy Manual',
          url: '/documents/cybersecurity-policy.pdf',
          type: 'pdf',
          isRequired: true
        }
      ],
      attempts: 0,
      maxAttempts: 3,
      passingScore: 80,
      prerequisites: [],
      tags: ['security', 'mandatory', 'annual'],
      reminderSent: false,
      autoAssign: true
    },
    {
      id: '2',
      title: 'NIST Cybersecurity Framework Certification',
      description: 'External certification program for NIST Cybersecurity Framework. Complete this course on the NIST learning platform.',
      category: 'IT_SECURITY',
      subcategory: 'Certification',
      type: 'external_link',
      isRequired: false,
      priority: 'high',
      status: 'not_started',
      assignedBy: 'IT Security Manager',
      assignedDate: '2025-07-10',
      dueDate: '2025-09-30',
      estimatedDuration: 480, // 8 hours
      progress: 0,
      hasVideo: false,
      hasQuiz: false,
      hasDocuments: true,
      externalUrl: 'https://www.nist.gov/cyberframework/online-learning',
      documents: [
        {
          id: 'doc2',
          name: 'NIST Framework Guide',
          url: '/documents/nist-framework-guide.pdf',
          type: 'pdf',
          isRequired: true
        }
      ],
      attempts: 0,
      maxAttempts: 1,
      passingScore: 70,
      prerequisites: ['1'],
      tags: ['certification', 'external', 'advanced'],
      reminderSent: false,
      autoAssign: false
    },
    {
      id: '3',
      title: 'Data Privacy & GDPR Compliance',
      description: 'Understanding data privacy regulations, GDPR requirements, and proper handling of customer information.',
      category: 'COMPLIANCE',
      subcategory: 'Data Protection',
      type: 'document_review',
      isRequired: true,
      priority: 'high',
      status: 'in_progress',
      assignedBy: 'Compliance Officer',
      assignedDate: '2025-06-15',
      dueDate: '2025-08-01',
      estimatedDuration: 60,
      progress: 35,
      hasVideo: false,
      hasQuiz: true,
      hasDocuments: true,
      quizUrl: '/training/quizzes/gdpr-compliance',
      documents: [
        {
          id: 'doc3',
          name: 'GDPR Compliance Manual',
          url: '/documents/gdpr-manual.pdf',
          type: 'pdf',
          isRequired: true
        },
        {
          id: 'doc4',
          name: 'Data Handling Procedures',
          url: '/documents/data-handling.doc',
          type: 'doc',
          isRequired: true
        }
      ],
      attempts: 1,
      maxAttempts: 2,
      passingScore: 85,
      lastScore: 72,
      prerequisites: [],
      tags: ['compliance', 'privacy', 'mandatory'],
      reminderSent: true,
      autoAssign: true
    },
    
    // Human Resources
    {
      id: '4',
      title: 'Workplace Harassment Prevention',
      description: 'Mandatory training on preventing workplace harassment, creating inclusive environments, and reporting procedures.',
      category: 'HUMAN_RESOURCES',
      subcategory: 'Workplace Conduct',
      type: 'internal_video_quiz',
      isRequired: true,
      priority: 'critical',
      status: 'completed',
      assignedBy: 'HR Director',
      assignedDate: '2025-05-01',
      dueDate: '2025-07-01',
      completedDate: '2025-06-20',
      estimatedDuration: 30,
      progress: 100,
      hasVideo: true,
      hasQuiz: true,
      hasDocuments: true,
      videoUrl: '/training/videos/harassment-prevention.mp4',
      quizUrl: '/training/quizzes/harassment-prevention',
      documents: [
        {
          id: 'doc5',
          name: 'Anti-Harassment Policy',
          url: '/documents/anti-harassment-policy.pdf',
          type: 'pdf',
          isRequired: true
        }
      ],
      attempts: 1,
      maxAttempts: 2,
      passingScore: 90,
      lastScore: 95,
      bestScore: 95,
      prerequisites: [],
      tags: ['hr', 'mandatory', 'annual', 'conduct'],
      reminderSent: false,
      autoAssign: true
    },
    {
      id: '5',
      title: 'Diversity & Inclusion Workshop',
      description: 'Interactive webinar on building diverse and inclusive teams. Hosted by external D&I consultants.',
      category: 'HUMAN_RESOURCES',
      subcategory: 'Diversity & Inclusion',
      type: 'webinar',
      isRequired: false,
      priority: 'medium',
      status: 'not_started',
      assignedBy: 'HR Business Partner',
      assignedDate: '2025-07-15',
      dueDate: '2025-08-30',
      estimatedDuration: 120,
      progress: 0,
      hasVideo: false,
      hasQuiz: false,
      hasDocuments: true,
      externalUrl: 'https://webinar.diversityinc.com/moses-automall-session',
      documents: [
        {
          id: 'doc6',
          name: 'D&I Best Practices Guide',
          url: '/documents/di-best-practices.pdf',
          type: 'pdf',
          isRequired: false
        }
      ],
      attempts: 0,
      maxAttempts: 1,
      passingScore: 0, // No scoring for webinars
      prerequisites: [],
      tags: ['hr', 'webinar', 'diversity', 'optional'],
      assignmentNote: 'Live session scheduled for August 15th, 2:00 PM EST',
      reminderSent: false,
      autoAssign: false
    },
    
    // Safety
    {
      id: '6',
      title: 'Workplace Safety & Emergency Procedures',
      description: 'Essential safety training covering emergency evacuation, first aid basics, and workplace hazard identification.',
      category: 'SAFETY',
      subcategory: 'Emergency Response',
      type: 'hands_on',
      isRequired: true,
      priority: 'critical',
      status: 'overdue',
      assignedBy: 'Safety Officer',
      assignedDate: '2025-06-01',
      dueDate: '2025-07-15',
      estimatedDuration: 90,
      progress: 0,
      hasVideo: true,
      hasQuiz: true,
      hasDocuments: true,
      videoUrl: '/training/videos/safety-procedures.mp4',
      quizUrl: '/training/quizzes/safety-procedures',
      documents: [
        {
          id: 'doc7',
          name: 'Emergency Response Plan',
          url: '/documents/emergency-response.pdf',
          type: 'pdf',
          isRequired: true
        }
      ],
      attempts: 0,
      maxAttempts: 2,
      passingScore: 85,
      prerequisites: [],
      tags: ['safety', 'mandatory', 'hands-on'],
      assignmentNote: 'Includes practical demonstration component - schedule with Safety Officer',
      reminderSent: true,
      autoAssign: true
    }
  ];

  useEffect(() => {
    fetchTrainingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTrainingData = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would be an API call
      // const response = await apiService.get('/api/training/user-trainings');
      
      // For now, use mock data
      setTrainings(mockTrainings);
      
      // Calculate progress metrics
      const totalAssigned = mockTrainings.length;
      const completed = mockTrainings.filter(t => t.status === 'completed').length;
      const inProgress = mockTrainings.filter(t => t.status === 'in_progress').length;
      const overdue = mockTrainings.filter(t => {
        const dueDate = new Date(t.dueDate);
        const now = new Date();
        return dueDate < now && t.status !== 'completed';
      }).length;
      
      const completionPercentage = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0;
      const totalTimeSpent = mockTrainings.reduce((sum, t) => {
        return sum + (t.progress / 100) * t.estimatedDuration;
      }, 0);
      
      const scoresAvailable = mockTrainings.filter(t => t.lastScore !== undefined);
      const averageScore = scoresAvailable.length > 0 
        ? Math.round(scoresAvailable.reduce((sum, t) => sum + (t.lastScore || 0), 0) / scoresAvailable.length)
        : 0;
        
      const certifications = mockTrainings.filter(t => t.type === 'certification' && t.status === 'completed').length;
      
      setProgress({
        totalAssigned,
        completed,
        inProgress,
        overdue,
        completionPercentage,
        totalTimeSpent: Math.round(totalTimeSpent),
        averageScore,
        certifications
      });
      
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (trainingId: string) => {
    try {
      // In a real implementation, this would be an API call
      // await apiService.post(`/api/training/${trainingId}/complete`);
      
      setTrainings(prev => prev.map(training => 
        training.id === trainingId 
          ? { 
              ...training, 
              status: 'completed' as const,
              progress: 100,
              completedDate: new Date().toISOString().split('T')[0]
            }
          : training
      ));
      
      // Refresh progress calculation
      fetchTrainingData();
    } catch (error) {
      console.error('Error marking training complete:', error);
    }
  };

  const handleStartTraining = (training: Training) => {
    if (training.type === 'external_link' && training.externalUrl) {
      window.open(training.externalUrl, '_blank');
    } else if (training.type === 'webinar' && training.externalUrl) {
      window.open(training.externalUrl, '_blank');
    } else {
      // Handle internal training types
      alert(`Starting ${training.title}.\nType: ${training.type}\nThis will open the training interface.`);
    }
    
    // Update status to in_progress if not started
    if (training.status === 'not_started') {
      setTrainings(prev => prev.map(t => 
        t.id === training.id 
          ? { ...t, status: 'in_progress' as const, progress: 5 }
          : t
      ));
    }
  };

  // Filter and sort trainings
  const getFilteredAndSortedTrainings = () => {
    let filtered = trainings;
    
    // Category filter
    if (activeCategory !== 'ALL') {
      filtered = filtered.filter(t => t.category === activeCategory);
    }
    
    // Type filter
    switch (filterType) {
      case 'required':
        filtered = filtered.filter(t => t.isRequired);
        break;
      case 'overdue':
        filtered = filtered.filter(t => {
          const dueDate = new Date(t.dueDate);
          const now = new Date();
          return dueDate < now && t.status !== 'completed';
        });
        break;
      case 'in_progress':
        filtered = filtered.filter(t => t.status === 'in_progress');
        break;
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'assignedDate':
          return new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime();
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredTrainings = getFilteredAndSortedTrainings();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white">Loading training center...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Learning Management System</h1>
        <p className="text-gray-300">
          Comprehensive training platform for IT Security, HR, Compliance, and Safety modules.
        </p>
      </div>

      {/* Advanced Progress Dashboard */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Training Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="text-center p-4 bg-gray-700/30 rounded-lg">
            <div className="text-3xl font-bold text-green-400">
              {progress?.completed || 0}
            </div>
            <div className="text-sm text-gray-300">Completed</div>
          </div>
          <div className="text-center p-4 bg-gray-700/30 rounded-lg">
            <div className="text-3xl font-bold text-yellow-400">
              {progress?.inProgress || 0}
            </div>
            <div className="text-sm text-gray-300">In Progress</div>
          </div>
          <div className="text-center p-4 bg-gray-700/30 rounded-lg">
            <div className="text-3xl font-bold text-red-400">
              {progress?.overdue || 0}
            </div>
            <div className="text-sm text-gray-300">Overdue</div>
          </div>
          <div className="text-center p-4 bg-gray-700/30 rounded-lg">
            <div className="text-3xl font-bold text-blue-400">
              {progress?.completionPercentage || 0}%
            </div>
            <div className="text-sm text-gray-300">Overall Progress</div>
          </div>
        </div>
        
        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-700/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {progress?.totalTimeSpent || 0}min
            </div>
            <div className="text-sm text-gray-300">Time Spent Learning</div>
          </div>
          <div className="text-center p-4 bg-gray-700/20 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">
              {progress?.averageScore || 0}%
            </div>
            <div className="text-sm text-gray-300">Average Score</div>
          </div>
          <div className="text-center p-4 bg-gray-700/20 rounded-lg">
            <div className="text-2xl font-bold text-indigo-400">
              {progress?.certifications || 0}
            </div>
            <div className="text-sm text-gray-300">Certifications</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress?.completionPercentage || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Controls */}
      <div className="card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value as any)}
              className="form-input w-full"
            >
              <option value="ALL">All Categories</option>
              <option value="IT_SECURITY">🔒 IT Security</option>
              <option value="HUMAN_RESOURCES">👥 Human Resources</option>
              <option value="COMPLIANCE">📋 Compliance</option>
              <option value="SAFETY">🚨 Safety</option>
              <option value="GENERAL">📚 General</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="form-input w-full"
            >
              <option value="all">All Trainings</option>
              <option value="required">Required Only</option>
              <option value="overdue">Overdue</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="form-input w-full"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="assignedDate">Assigned Date</option>
            </select>
          </div>

          {/* View Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">View</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 rounded text-sm ${
                  viewMode === 'cards' ? 'btn-primary' : 'btn'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 rounded text-sm ${
                  viewMode === 'table' ? 'btn-primary' : 'btn'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Training Count */}
        <div className="text-sm text-gray-400">
          Showing {filteredTrainings.length} of {trainings.length} trainings
        </div>
      </div>

      {/* Training Content */}
      <div className="card">
        {viewMode === 'cards' ? (
          <div className="p-6 space-y-4">
            {filteredTrainings.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                onMarkComplete={handleMarkComplete}
                onStartTraining={handleStartTraining}
              />
            ))}
            {filteredTrainings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">📚</div>
                <p className="text-gray-400">No training modules match your current filters.</p>
              </div>
            )}
          </div>
        ) : (
          <TrainingTable 
            trainings={filteredTrainings}
            onMarkComplete={handleMarkComplete}
            onStartTraining={handleStartTraining}
          />
        )}
      </div>
    </div>
  );
};

interface TrainingCardProps {
  training: Training;
  onMarkComplete: (id: string) => void;
  onStartTraining: (training: Training) => void;
}

const TrainingCard: React.FC<TrainingCardProps> = ({ training, onMarkComplete, onStartTraining }) => {
  const isOverdue = new Date(training.dueDate) < new Date() && training.status !== 'completed';
  const isDueSoon = new Date(training.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-900 text-red-200';
      case 'high': return 'bg-orange-900 text-orange-200';
      case 'medium': return 'bg-yellow-900 text-yellow-200';
      case 'low': return 'bg-green-900 text-green-200';
      default: return 'bg-gray-900 text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'internal_video_quiz': return '🎥';
      case 'external_link': return '🔗';
      case 'document_review': return '📄';
      case 'webinar': return '🎤';
      case 'hands_on': return '👷';
      case 'certification': return '🏆';
      default: return '📚';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'IT_SECURITY': return 'bg-blue-900 text-blue-200';
      case 'HUMAN_RESOURCES': return 'bg-green-900 text-green-200';
      case 'COMPLIANCE': return 'bg-purple-900 text-purple-200';
      case 'SAFETY': return 'bg-red-900 text-red-200';
      case 'GENERAL': return 'bg-gray-900 text-gray-200';
      default: return 'bg-gray-900 text-gray-200';
    }
  };

  return (
    <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="text-lg font-medium text-white">{training.title}</h3>
            <span className="text-lg">{getTypeIcon(training.type)}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(training.category)}`}>
              {training.category.replace('_', ' ')}
            </span>
            {training.subcategory && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
                {training.subcategory}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(training.priority)}`}>
              {training.priority.toUpperCase()}
            </span>
            {training.isRequired && (
              <span className="px-2 py-1 text-xs font-medium bg-red-900 text-red-200 rounded-full">
                Required
              </span>
            )}
            <span 
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                training.status === 'completed' 
                  ? 'bg-green-900 text-green-200'
                  : isOverdue
                  ? 'bg-red-900 text-red-200'
                  : isDueSoon
                  ? 'bg-yellow-900 text-yellow-200'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {training.status === 'completed' ? 'Completed' : 
               isOverdue ? 'Overdue' :
               isDueSoon ? 'Due Soon' : training.status.replace('_', ' ')}
            </span>
          </div>
          
          <p className="text-gray-300 mb-4">{training.description}</p>
          
          {/* Training Details */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-400">Assigned by:</span>
              <span className="text-white ml-2">{training.assignedBy}</span>
            </div>
            <div>
              <span className="text-gray-400">Duration:</span>
              <span className="text-white ml-2">{training.estimatedDuration} minutes</span>
            </div>
            <div>
              <span className="text-gray-400">Due Date:</span>
              <span className="text-white ml-2">{new Date(training.dueDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-400">Progress:</span>
              <span className="text-white ml-2">{training.progress}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          {training.progress > 0 && (
            <div className="mb-4">
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${training.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Score Information */}
          {training.lastScore !== undefined && (
            <div className="flex items-center space-x-4 mb-4 text-sm">
              <span className="text-gray-400">Last Score:</span>
              <span className={`font-medium ${
                training.lastScore >= training.passingScore ? 'text-green-400' : 'text-red-400'
              }`}>
                {training.lastScore}% (Pass: {training.passingScore}%)
              </span>
              {training.bestScore && training.bestScore !== training.lastScore && (
                <span className="text-gray-400">Best: <span className="text-green-400">{training.bestScore}%</span></span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {training.status !== 'completed' && (
              <button
                onClick={() => onStartTraining(training)}
                className="btn btn-primary text-sm flex items-center space-x-2"
              >
                <span>{training.status === 'not_started' ? 'Start Training' : 'Continue'}</span>
                {training.type === 'external_link' && <span>🔗</span>}
              </button>
            )}
            
            {training.status === 'in_progress' && (
              <button
                onClick={() => onMarkComplete(training.id)}
                className="btn text-sm"
              >
                Mark Complete
              </button>
            )}

            {training.documents && training.documents.length > 0 && (
              <button className="btn text-sm flex items-center space-x-2">
                <span>📄</span>
                <span>Documents ({training.documents.length})</span>
              </button>
            )}
          </div>

          {/* Assignment Note */}
          {training.assignmentNote && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Assignment Note:</div>
              <div className="text-sm text-blue-200">{training.assignmentNote}</div>
            </div>
          )}
        </div>
        
        <div className="ml-6">
          {training.status === 'completed' ? (
            <div className="flex items-center text-green-400">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          ) : isOverdue ? (
            <div className="flex items-center text-red-400">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="text-gray-400">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L10 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TrainingTableProps {
  trainings: Training[];
  onMarkComplete: (id: string) => void;
  onStartTraining: (training: Training) => void;
}

const TrainingTable: React.FC<TrainingTableProps> = ({ trainings, onMarkComplete, onStartTraining }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-4 text-gray-300">Training</th>
            <th className="text-left p-4 text-gray-300">Category</th>
            <th className="text-left p-4 text-gray-300">Type</th>
            <th className="text-left p-4 text-gray-300">Priority</th>
            <th className="text-left p-4 text-gray-300">Status</th>
            <th className="text-left p-4 text-gray-300">Progress</th>
            <th className="text-left p-4 text-gray-300">Due Date</th>
            <th className="text-left p-4 text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map((training) => (
            <tr key={training.id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
              <td className="p-4">
                <div className="font-medium text-white">{training.title}</div>
                <div className="text-xs text-gray-400">{training.assignedBy}</div>
              </td>
              <td className="p-4">
                <span className="text-gray-300">{training.category.replace('_', ' ')}</span>
              </td>
              <td className="p-4">
                <span className="text-gray-300">{training.type.replace('_', ' ')}</span>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  training.priority === 'critical' ? 'bg-red-900 text-red-200' :
                  training.priority === 'high' ? 'bg-orange-900 text-orange-200' :
                  training.priority === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                  'bg-green-900 text-green-200'
                }`}>
                  {training.priority}
                </span>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  training.status === 'completed' ? 'bg-green-900 text-green-200' :
                  training.status === 'overdue' ? 'bg-red-900 text-red-200' :
                  training.status === 'in_progress' ? 'bg-yellow-900 text-yellow-200' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {training.status.replace('_', ' ')}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${training.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-300 text-xs">{training.progress}%</span>
                </div>
              </td>
              <td className="p-4">
                <span className="text-gray-300">{new Date(training.dueDate).toLocaleDateString()}</span>
              </td>
              <td className="p-4">
                <div className="flex space-x-2">
                  {training.status !== 'completed' && (
                    <button
                      onClick={() => onStartTraining(training)}
                      className="btn-primary px-3 py-1 text-xs rounded"
                    >
                      {training.status === 'not_started' ? 'Start' : 'Continue'}
                    </button>
                  )}
                  {training.status === 'in_progress' && (
                    <button
                      onClick={() => onMarkComplete(training.id)}
                      className="btn px-3 py-1 text-xs rounded"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainingCenter;
