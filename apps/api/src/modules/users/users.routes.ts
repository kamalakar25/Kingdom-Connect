import { Router } from 'express';
import * as UserController from './users.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router();

router.use(authenticate);

router.get('/me', UserController.getProfile);
router.patch('/me', UserController.updateProfile);
router.post('/avatar', upload.single('avatar'), UserController.uploadAvatar);
router.delete('/me', UserController.deleteAccount);

export default router;
