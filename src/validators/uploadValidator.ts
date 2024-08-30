import { body } from 'express-validator';

const uploadValidator = [
    body('image')
        .isBase64()
        .withMessage('Image must be in base64 format.'),
    body('customer_code')
        .isString()
        .withMessage('Customer code must be a string.'),
    body('measure_datetime')
        .isISO8601()
        .withMessage('Measurement date must be in ISO8601 format.'),
    body('measure_type')
        .isIn(['WATER', 'GAS'])
        .withMessage('Measurement type must be WATER or GAS.'),
];

export default uploadValidator;