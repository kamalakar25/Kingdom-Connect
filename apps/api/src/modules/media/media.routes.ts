import { Router } from 'express';
import * as MediaController from './media.controller';

const router = Router();

router.get('/', MediaController.list);
router.post('/seed', MediaController.seed);

export default router;
