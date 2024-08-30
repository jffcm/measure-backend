import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import createErrorResponse from '../utils/createErrorResponse';

function typeValidationMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(
            createErrorResponse('INVALID_DATA', errors.array().map(err => err.msg) as any)
        );
    }

    next();
};

export { typeValidationMiddleware };

