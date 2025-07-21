import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Mock events data - replace with database queries
const mockEvents = [
  {
    id: '1',
    title: 'Monthly Team Meeting',
    description: 'All-hands meeting to discuss monthly goals and achievements',
    date: '2025-08-15',
    time: '10:00 AM',
    location: 'Conference Room A',
    department: 'All',
    isRequired: true
  },
  {
    id: '2',
    title: 'Sales Training Workshop',
    description: 'Advanced sales techniques and customer relationship management',
    date: '2025-08-22',
    time: '2:00 PM',
    location: 'Training Center',
    department: 'Sales',
    isRequired: false
  }
];

// Get upcoming events for current user
router.get('/', requireAuth, (req: Request, res: Response) => {
  // In a real app, filter by user's department and preferences
  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = mockEvents.filter(event => event.date >= today);
  
  res.json({ events: upcomingEvents });
});

// Get specific event details
router.get('/:id', requireAuth, (req: Request, res: Response) => {
  const event = mockEvents.find(e => e.id === req.params.id);
  if (event) {
    res.json({ event });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// RSVP to an event
router.post('/:id/rsvp', requireAuth, (req: Request, res: Response) => {
  const { attending } = req.body;
  const event = mockEvents.find(e => e.id === req.params.id);
  
  if (event) {
    // In a real app, save RSVP to database
    res.json({ message: `RSVP recorded: ${attending ? 'attending' : 'not attending'}` });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

export { router as eventsRouter };
