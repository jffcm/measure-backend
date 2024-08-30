import { Request, Response } from 'express';
import createErrorResponse from '../utils/createErrorResponse';
import measureService from '../services/measureService';

const listMeasuresHandler = async (req: Request, res: Response) => {
    try {        
        const { customer_code } = req.params;
        const { measure_type } = req.query;
        const { code, response } = await measureService.listMeasures(customer_code, measure_type as string);
        return res.status(code).json(response);
    } catch (error) {
        console.error('error in listController.listMeasuresHandler:', error);
        return res.status(500).json(
            createErrorResponse('INTERNAL_SERVER_ERROR', 'Ocorreu um erro no servidor')
        );
    }
};

export default listMeasuresHandler;