import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Training {
  id: string;
  title: string;
  description: string;
  category: 'IT_SECURITY' | 'HUMAN_RESOURCES';
  isRequired: boolean;
  dueDate: string;
  status: string;
  hasVideo: boolean;
  hasQuiz: boolean;
  videoUrl?: string;
  quizUrl?: string;
}

const TrainingCenter: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'IT_SECURITY' | 'HUMAN_RESOURCES'>('IT_SECURITY');

  // Mock data for development - replace with API calls later
  const mockTrainings: Training[] = [
    // IT Security & Compliance
    {
      id: '1',
      title: 'Cybersecurity Awareness Training',
      description: 'Essential cybersecurity practices for all employees including phishing awareness, password security, and data protection.',
      category: 'IT_SECURITY',
      isRequired: true,
      dueDate: '2025-08-15',
      status: 'pending',
      hasVideo: true,
      hasQuiz: true,
      videoUrl: '/training/videos/cybersecurity-awareness.mp4',
      quizUrl: '/training/quizzes/cybersecurity-quiz'
    },
    {
      id: '2',
      title: 'Data Privacy & GDPR Compliance',
      description: 'Understanding data privacy regulations, GDPR requirements, and proper handling of customer data.',
      category: 'IT_SECURITY',
      isRequired: true,
      dueDate: '2025-08-20',
      status: 'pending',
      hasVideo: true,
      hasQuiz: true,
      videoUrl: '/training/videos/gdpr-compliance.mp4',
      quizUrl: '/training/quizzes/gdpr-quiz'
    },
    {
      id: '3',
      title: 'Incident Response Procedures',
      description: 'How to recognize, report, and respond to security incidents and data breaches.',
      category: 'IT_SECURITY',
      isRequired: false,
      dueDate: '2025-09-01',
      status: 'pending',
      hasVideo: true,
      hasQuiz: true,
      videoUrl: '/training/videos/incident-response.mp4',
      quizUrl: '/training/quizzes/incident-response-quiz'
    },
    // Human Resources
    {
      id: '4',
      title: 'Workplace Harassment Prevention',
      description: 'Creating a respectful workplace environment and understanding harassment prevention policies.',
      category: 'HUMAN_RESOURCES',
      isRequired: true,
      dueDate: '2025-08-10',
      status: 'completed',
      hasVideo: true,
      hasQuiz: true,
      videoUrl: '/training/videos/harassment-prevention.mp4',
      quizUrl: '/training/quizzes/harassment-prevention-quiz'
    },
    {
      id: '5',
      title: 'Diversity & Inclusion Training',
      description: 'Building an inclusive workplace culture and understanding unconscious bias.',
      category: 'HUMAN_RESOURCES',
      isRequired: true,
      dueDate: '2025-08-25',
      status: 'pending',
      hasVideo: true,
      hasQuiz: true,
      videoUrl: '/training/videos/diversity-inclusion.mp4',
      quizUrl: '/training/quizzes/diversity-inclusion-quiz'
    },
    {
      id: '6',
      title: 'Employee Benefits Overview',
      description: 'Understanding your employee benefits package, healthcare options, and retirement planning.',
      category: 'HUMAN_RESOURCES',
      isRequired: false,
      dueDate: '2025-09-15',
      status: 'pending',
      hasVideo: true,
      hasQuiz: false,
      videoUrl: '/training/videos/employee-benefits.mp4'
    }
  ];

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      // For now, use mock data - replace with actual API calls later
      setTrainings(mockTrainings);
      
      // Calculate progress
      const totalRequired = mockTrainings.filter(t => t.isRequired).length;
      const completedRequired = mockTrainings.filter(t => t.isRequired && t.status === 'completed').length;
      const totalCompleted = mockTrainings.filter(t => t.status === 'completed').length;
      
      setProgress({
        completed: totalCompleted,
        pendingRequired: totalRequired - completedRequired,
        completionPercentage: Math.round((completedRequired / totalRequired) * 100)
      });
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (trainingId: string) => {
    try {
      await apiService.training.markComplete(trainingId);
      // Update local state
      setTrainings(prev => prev.map(t => 
        t.id === trainingId ? { ...t, status: 'completed' } : t
      ));
      // Refresh progress calculation
      fetchTrainingData();
    } catch (error) {
      console.error('Error marking training complete:', error);
    }
  };

  const filteredTrainings = trainings.filter(t => t.category === activeCategory);

  if (loading) {
    return <div className="p-6">Loading training center...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Training Center</h1>
        <p className="text-gray-300">
          Complete your required IT Security & Compliance and Human Resources training modules.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {progress?.completed || 0}
            </div>
            <div className="text-sm text-gray-300">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {progress?.pendingRequired || 0}
            </div>
            <div className="text-sm text-gray-300">Pending Required</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">
              {progress?.completionPercentage || 0}%
            </div>
            <div className="text-sm text-gray-300">Overall Progress</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="bg-gray-700 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress?.completionPercentage || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="card">
        <div className="border-b border-gray-600">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveCategory('IT_SECURITY')}
              className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeCategory === 'IT_SECURITY'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              <span>🔒</span>
              <span>IT Security & Compliance</span>
            </button>
            <button
              onClick={() => setActiveCategory('HUMAN_RESOURCES')}
              className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeCategory === 'HUMAN_RESOURCES'
                  ? 'border-green-400 text-green-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              <span>👥</span>
              <span>Human Resources</span>
            </button>
          </nav>
        </div>

        {/* Training Content */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredTrainings.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                onMarkComplete={handleMarkComplete}
              />
            ))}
            {filteredTrainings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">
                  {activeCategory === 'IT_SECURITY' ? '🔒' : '👥'}
                </div>
                <p className="text-gray-400">No training modules available in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TrainingCardProps {
  training: Training;
  onMarkComplete: (id: string) => void;
}

const TrainingCard: React.FC<TrainingCardProps> = ({ training, onMarkComplete }) => {
  const isOverdue = new Date(training.dueDate) < new Date() && training.status !== 'completed';
  const isDueSoon = new Date(training.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const handleVideoClick = () => {
    // Placeholder for video functionality
    alert(`Video for "${training.title}" will open here.\nPlaceholder path: ${training.videoUrl}`);
  };

  const handleQuizClick = () => {
    // Placeholder for quiz functionality
    alert(`Quiz for "${training.title}" will open here.\nPlaceholder path: ${training.quizUrl}`);
  };

  return (
    <div className="card p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-white">{training.title}</h3>
            {training.category === 'IT_SECURITY' && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-900 text-blue-200 rounded-full">
                🔒 IT Security
              </span>
            )}
            {training.category === 'HUMAN_RESOURCES' && (
              <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-200 rounded-full">
                👥 HR
              </span>
            )}
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
               isDueSoon ? 'Due Soon' : 'Pending'}
            </span>
          </div>
          
          <p className="text-gray-300 mb-4">{training.description}</p>
          
          {/* Video and Quiz Buttons */}
          <div className="flex items-center space-x-4 mb-4">
            {training.hasVideo && (
              <button
                onClick={handleVideoClick}
                className="btn btn-primary text-sm flex items-center space-x-2"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Watch Video</span>
              </button>
            )}
            {training.hasQuiz && (
              <button
                onClick={handleQuizClick}
                className="btn text-sm flex items-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                  color: 'white',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span>Take Quiz</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-400">
            <span>Due: {new Date(training.dueDate).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>
              {training.hasVideo && training.hasQuiz ? 'Video + Quiz' :
               training.hasVideo ? 'Video Only' :
               training.hasQuiz ? 'Quiz Only' : 'Text Content'}
            </span>
          </div>
        </div>
        
        <div className="ml-6">
          {training.status === 'completed' ? (
            <div className="flex items-center text-green-400">
              <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Completed</span>
            </div>
          ) : (
            <button
              onClick={() => onMarkComplete(training.id)}
              className="btn btn-primary text-sm"
            >
              Mark Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingCenter;
