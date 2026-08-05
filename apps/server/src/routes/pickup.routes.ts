import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { create, update, remove, history, upcoming } from '../controllers/pickup.controller';

const router = Router();

router.use(requireAuth);

router.post('/create', create);
router.put('/update/:id', update);
router.delete('/delete/:id', remove);
router.get('/history', history);
router.get('/upcoming', upcoming);

export default router;