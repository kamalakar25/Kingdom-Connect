import { Router } from 'express';
import * as SSMController from './sunday-school.controller';

const router = Router();

router.get('/', SSMController.list);
router.post('/seed', SSMController.seed);

export default router;
