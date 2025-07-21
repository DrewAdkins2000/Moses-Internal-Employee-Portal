import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Mock training data - replace with database queries
const mockTrainings = [
  {
    id: '1',
    title: 'Safety Training Module 1',
    description: 'Basic workplace safety procedures',
    isRequired: true,
    dueDate: '2025-08-01',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Customer Service Excellence',
    description: 'Best practices for customer interactions',
    isRequired: false,
    dueDate: '2025-09-01',
    status: 'completed'
  }
];

// Get all training modules for current user
router.get('/', requireAuth, (req: Request, res: Response) => {
  // In a real app, this would query database based on user assignments
  res.json({ trainings: mockTrainings });
});

// Get specific training module
router.get('/:id', requireAuth, (req: Request, res: Response) => {
  const training = mockTrainings.find(t => t.id === req.params.id);
  if (training) {
    res.json({ training });
  } else {
    res.status(404).json({ message: 'Training module not found' });
  }
});

// Mark training as completed
router.post('/:id/complete', requireAuth, (req: Request, res: Response) => {
  const training = mockTrainings.find(t => t.id === req.params.id);
  if (training) {
    training.status = 'completed';
    res.json({ message: 'Training marked as completed', training });
  } else {
    res.status(404).json({ message: 'Training module not found' });
  }
});

// Get training progress for current user
router.get('/progress/summary', requireAuth, (req: Request, res: Response) => {
  const completed = mockTrainings.filter(t => t.status === 'completed').length;
  const total = mockTrainings.length;
  const pending = mockTrainings.filter(t => t.status === 'pending' && t.isRequired).length;
  
  res.json({
    progress: {
      completed,
      total,
      pendingRequired: pending,
      completionPercentage: Math.round((completed / total) * 100)
    }
  });
});

export { router as trainingRouter };
