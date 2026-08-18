import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { listMyPickups, listMyHistory, updateMyPickupStatus } from '../controllers/driver.controller';
const router = Router();
router.use(requireAuth, requireRole('DRIVER'));
router.get('/pickups', listMyPickups);
router.get('/history', listMyHistory);
router.patch('/pickups/:id/status', updateMyPickupStatus);
export default router;