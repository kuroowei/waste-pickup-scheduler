import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { create, list, remove } from '../controllers/announcement.controller';

const router = Router();

router.use(requireAuth);

router.get('/list', list);
router.post('/create', requireRole('ADMIN'), create);
router.delete('/:id', requireRole('ADMIN'), remove);

export default router;