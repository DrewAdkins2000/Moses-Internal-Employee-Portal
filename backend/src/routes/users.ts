import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Get current user profile
router.get('/profile', requireAuth, (req: Request, res: Response) => {
  const user = req.session?.user;
  if (user) {
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles
    });
  } else {
    res.status(401).json({ message: 'User not found' });
  }
});

// Update user profile (basic info)
router.put('/profile', requireAuth, (req: Request, res: Response) => {
  // This would typically update database
  // For now, just return success
  res.json({ message: 'Profile updated successfully' });
});

export { router as userRouter };
