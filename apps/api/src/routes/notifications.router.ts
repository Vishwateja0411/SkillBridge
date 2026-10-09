import { Router, Response } from 'express';
import { dbStore } from '../store/index.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/notifications
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const notifications = dbStore.getNotificationsByUserId(req.user!.id);
  const unreadCount = notifications.filter((n) => !n.read).length;
  return res.json({ success: true, count: notifications.length, unreadCount, notifications });
});

// PUT /api/v1/notifications/:id/read
router.put('/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const notif = dbStore.markNotificationRead(req.params.id);
  return res.json({ success: true, notification: notif });
});

// PUT /api/v1/notifications/read-all
router.put('/read-all', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  dbStore.markAllNotificationsRead(req.user!.id);
  return res.json({ success: true, message: 'All notifications marked as read' });
});

export default router;
