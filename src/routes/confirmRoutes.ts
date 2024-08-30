import { Router } from 'express';
import confirmMeasureHandler from '../controllers/confirmController';
import confirmValidator from '../validators/confirmValidator';
import { typeValidationMiddleware } from '../middleware/errorHandler';

const router = Router();

router.patch(
    '/',
    confirmValidator,
    typeValidationMiddleware,
    confirmMeasureHandler
);

export default router;