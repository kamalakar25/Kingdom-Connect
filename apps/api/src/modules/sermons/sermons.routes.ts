import { Router } from 'express';
import * as SermonController from './sermons.controller';

const router = Router();

router.get('/', SermonController.list);
router.post('/seed', SermonController.seed);

export default router;
