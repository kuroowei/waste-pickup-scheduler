import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { listUsers, listPickups, updateStatus, dashboard, listFeedback } from '../controllers/admin.controller';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/users', listUsers);
router.get('/pickups', listPickups);
router.put('/pickups/:id/status', updateStatus);
router.get('/dashboard', dashboard);
router.get('/feedback', listFeedback);

export default router;