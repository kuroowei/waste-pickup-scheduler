import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { create, list, adminList, adminUpdateStatus } from '../controllers/complaint.controller';

const router = Router();

router.use(requireAuth);

router.post('/create', create);
router.get('/list', list);
router.get('/admin/list', requireRole('ADMIN'), adminList);
router.put('/admin/:id/status', requireRole('ADMIN'), adminUpdateStatus);

export default router;