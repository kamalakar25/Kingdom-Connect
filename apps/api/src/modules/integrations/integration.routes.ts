import { Router } from 'express';
import * as LiveController from './live.controller';

const router = Router();

router.get('/config', LiveController.getLiveConfig);

export default router;
