import { Router } from 'express';
import listMeasuresHandler from '../controllers/listController';

const router = Router();

router.get('/:customer_code/list', listMeasuresHandler as any);

export default router;