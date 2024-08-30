import { body } from 'express-validator';

const confirmValidator = [
    body('measure_uuid')
        .isUUID()
        .withMessage('Measure UUID must be a valid UUID format.'),
    body('confirmed_value')
        .isInt()
        .withMessage('Confirmed value must be an integer.'),
];

export default confirmValidator;