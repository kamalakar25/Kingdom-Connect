import { Router } from 'express';
import * as CommController from './communication.controller';

const router = Router();

router.get('/announcements', CommController.listAnnouncements);
router.get('/events', CommController.listEvents);
router.post('/subscribe', CommController.subscribeToPush);
router.post('/seed', CommController.seed);

export default router;
