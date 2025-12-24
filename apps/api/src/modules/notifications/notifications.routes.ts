import { Router } from 'express';
import { subscribe, sendTestNotification, getVapidKey } from './notifications.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/subscribe', authenticate, subscribe);
router.post('/send-test', authenticate, sendTestNotification);
router.get('/vapid-key', getVapidKey);

export default router;
