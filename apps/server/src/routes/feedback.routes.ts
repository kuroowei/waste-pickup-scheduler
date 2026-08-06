import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { create, list } from '../controllers/feedback.controller';

const router = Router();

router.use(requireAuth);

router.post('/create', create);
router.get('/list', list);

export default router;