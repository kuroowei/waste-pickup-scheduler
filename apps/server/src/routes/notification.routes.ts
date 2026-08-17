import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { listNotifications, markRead, markAllRead } from '../controllers/notification.controller';
const router = Router();
router.use(requireAuth);
router.get('/', listNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);
export default router;