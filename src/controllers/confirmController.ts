import { Request, Response } from 'express';
import ConfirmMeasureRequest from '../request/ConfirmMeasureRequest';
import createErrorResponse from '../utils/createErrorResponse';
import measureService from '../services/measureService';

const confirmMeasureHandler = async (req: Request, res: Response) => {
    try {
        const { measure_uuid, confirmed_value }: ConfirmMeasureRequest = req.body;
        const { code, response } = await measureService.confirmMeasure(measure_uuid, confirmed_value);
        return res.status(code).json(response);
    } catch (error) {
        console.error('error in confirmController.confirmMeasureHandler:', error);
        return res.status(500).json(
            createErrorResponse('INTERNAL_SERVER_ERROR', 'Ocorreu um erro no servidor')
        );
    }
};

export default confirmMeasureHandler;
