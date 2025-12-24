import { Router } from 'express';
import * as UserController from './users.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/me', UserController.getProfile);
router.patch('/me', UserController.updateProfile);
router.delete('/me', UserController.deleteAccount);

export default router;
