import { Router } from 'express';
import uploadImage from '../controllers/uploadController';
import { typeValidationMiddleware } from '../middleware/errorHandler';
import uploadValidator from '../validators/uploadValidator';

const router = Router();

router.post(
    '/',
    uploadValidator,
    typeValidationMiddleware,
    uploadImage
);

export default router;