import { Router, Request, Response } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Mock users data - replace with database queries
const mockUsers = [
  {
    id: '1',
    email: 'drewadkins@mosesautonet.com',
    name: 'Drew Adkins',
    department: 'Management',
    roles: ['Admin', 'Manager'],
    lastLogin: '2025-07-21T09:00:00Z'
  },
  {
    id: '2',
    email: 'john.doe@mosesautonet.com',
    name: 'John Doe',
    department: 'Sales',
    roles: ['Employee'],
    lastLogin: '2025-07-20T14:30:00Z'
  }
];

// Get all users (Admin only)
router.get('/users', requireAuth, requireAdmin, (req: Request, res: Response) => {
  res.json({ users: mockUsers });
});

// Get user details (Admin only)
router.get('/users/:id', requireAuth, requireAdmin, (req: Request, res: Response) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Update user roles (Admin only)
router.put('/users/:id/roles', requireAuth, requireAdmin, (req: Request, res: Response) => {
  const { roles } = req.body;
  const user = mockUsers.find(u => u.id === req.params.id);
  
  if (user) {
    user.roles = roles;
    res.json({ message: 'User roles updated successfully', user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Assign training to user (Admin only)
router.post('/users/:id/training', requireAuth, requireAdmin, (req: Request, res: Response) => {
  const { trainingId, dueDate } = req.body;
  
  // In a real app, create training assignment in database
  res.json({ 
    message: 'Training assigned successfully',
    assignment: {
      userId: req.params.id,
      trainingId,
      dueDate,
      assignedAt: new Date().toISOString()
    }
  });
});

// Get system statistics (Admin only)
router.get('/stats', requireAuth, requireAdmin, (req: Request, res: Response) => {
  const stats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(u => {
      const lastLogin = new Date(u.lastLogin);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastLogin >= thirtyDaysAgo;
    }).length,
    pendingTraining: 5, // Mock data
    upcomingEvents: 3,   // Mock data
    documentsAccessed: 127 // Mock data
  };
  
  res.json({ stats });
});

// Create announcement (Admin only)
router.post('/announcements', requireAuth, requireAdmin, (req: Request, res: Response) => {
  const { title, content, targetUsers, expiresAt } = req.body;
  
  const announcement = {
    id: Date.now().toString(),
    title,
    content,
    targetUsers,
    expiresAt,
    createdAt: new Date().toISOString(),
    createdBy: req.session?.user?.email
  };
  
  res.json({ message: 'Announcement created successfully', announcement });
});

export { router as adminRouter };
