import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { listUsers, listPickups, updateStatus, dashboard } from '../controllers/admin.controller';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/users', listUsers);
router.get('/pickups', listPickups);
router.put('/pickups/:id/status', updateStatus);
router.get('/dashboard', dashboard);

export default router;