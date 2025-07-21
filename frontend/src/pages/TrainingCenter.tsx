import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Training {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  dueDate: string;
  status: string;
}

const TrainingCenter: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const [trainingsResponse, progressResponse] = await Promise.all([
        apiService.training.getAll(),
        apiService.training.getProgress()
      ]);
      
      setTrainings((trainingsResponse.data as any).trainings);
      setProgress((progressResponse.data as any).progress);
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (trainingId: string) => {
    try {
      await apiService.training.markComplete(trainingId);
      // Refresh data
      fetchTrainingData();
    } catch (error) {
      console.error('Error marking training complete:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading training center...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Training Center</h1>
        <p className="text-gray-600">
          Complete your required training modules and track your progress.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {progress?.completed || 0}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {progress?.pendingRequired || 0}
            </div>
            <div className="text-sm text-gray-600">Pending Required</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {progress?.completionPercentage || 0}%
            </div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress?.completionPercentage || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Training Modules */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Training Modules</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {trainings.map((training) => (
            <TrainingCard
              key={training.id}
              training={training}
              onMarkComplete={handleMarkComplete}
            />
          ))}
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

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900">{training.title}</h3>
            {training.isRequired && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Required
              </span>
            )}
            <span 
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                training.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : isOverdue
                  ? 'bg-red-100 text-red-800'
                  : isDueSoon
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {training.status === 'completed' ? 'Completed' : 
               isOverdue ? 'Overdue' :
               isDueSoon ? 'Due Soon' : 'Pending'}
            </span>
          </div>
          
          <p className="text-gray-600 mb-3">{training.description}</p>
          
          <div className="flex items-center text-sm text-gray-500">
            <span>Due: {new Date(training.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="ml-6">
          {training.status === 'completed' ? (
            <div className="flex items-center text-green-600">
              <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Completed</span>
            </div>
          ) : (
            <button
              onClick={() => onMarkComplete(training.id)}
              className="bg-moses-blue hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
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
