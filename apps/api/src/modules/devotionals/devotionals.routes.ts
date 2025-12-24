import { Router } from 'express';
import * as DevotionalController from './devotionals.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', DevotionalController.list);
router.get('/:id', DevotionalController.getOne);
router.post('/', authenticate, DevotionalController.create);

export default router;
