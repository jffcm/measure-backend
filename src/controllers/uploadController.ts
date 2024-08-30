import { Request, Response } from 'express';
import UploadRequest from '../request/UploadRequest';
import createErrorResponse from '../utils/createErrorResponse';
import measureService from '../services/measureService';

const uploadImage = async (req: Request, res: Response) => {
    try {
        const { image, customer_code, measure_datetime, measure_type }: UploadRequest = req.body;
        const { code, response } = await measureService.uploadImage(image, customer_code, measure_datetime, measure_type);
        return res.status(code).json(response);
    } catch (error) {
        console.error('error in uploadController.uploadImage:', error);
        return res.status(500).json(
            createErrorResponse('INTERNAL_SERVER_ERROR', 'Ocorreu um erro no servidor')
        );
    }
};

export default uploadImage;