import { Between } from "typeorm";
import { Measure } from "../models/Measure";
import createErrorResponse from "../utils/createErrorResponse";
import createSuccessResponse from "../utils/createSuccessResponse";
import GeminiService from "./geminiService";
import { v4 as uuidv4 } from 'uuid';

const measureService = {
    async confirmMeasure(measure_uuid: string, confirmed_value: number) {
        const measure = await Measure.findOne({ where: { measure_uuid: measure_uuid } });

        if (!measure) {
            return {
                code: 404,
                response: createErrorResponse('MEASURE_NOT_FOUND', 'Leitura não encontrada')
            };
        }

        if (measure.has_confirmed) {
            return {
                code: 409,
                response: createErrorResponse('CONFIRMATION_DUPLICATE', 'Leitura do mês já realizada'),
            };
        }

        measure.measure_value = confirmed_value;
        measure.has_confirmed = true;

        await measure.save();

        return {
            code: 200,
            response: createSuccessResponse(),
        };
    },

    async listMeasures(customer_code: string, measure_type?: string) {
        const validMeasureTypes = ['WATER', 'GAS'];
        const filter: Record<string, any> = { customer_code };
        
        if (measure_type) {
            const measureTypeUpperCase = measure_type.toUpperCase();
            if (!validMeasureTypes.includes(measureTypeUpperCase)) {
                return {
                    code: 400,
                    response: createErrorResponse('INVALID_TYPE', 'Tipo de medição não permitida'),
                };
            }

            filter.measure_type = measureTypeUpperCase;
        }

        const measures = await Measure.findBy(filter);

        if (!measures || measures.length === 0) {
            return {
                code: 404,
                response: createErrorResponse('MEASURES_NOT_FOUND', 'Nenhuma leitura encontrada'),
            };
        }

        const response = {
            customer_code,
            measures: measures.map((m) => ({
                measure_uuid: m.measure_uuid,
                measure_datetime: m.measure_datetime,
                measure_type: m.measure_type,
                has_confirmed: m.has_confirmed,
                image_url: m.image_url,
            })),
        };

        return {
            code: 200,
            response,
        };
    },

    async uploadImage(image: string, customer_code: string, measure_datetime: Date, measure_type: 'WATER' | 'GAS') {
        const measureDate = new Date(measure_datetime);
        const startOfMonth = new Date(measureDate.getFullYear(), measureDate.getMonth(), 1);
        const endOfMonth = new Date(measureDate.getFullYear(), measureDate.getMonth() + 1, 0);

        const existingMeasure = await Measure.findOne({
            where: {
                customer_code,
                measure_type,
                measure_datetime: Between(startOfMonth, endOfMonth),
            },
        });

        if (existingMeasure) {
            return {
                code: 409,
                response: createErrorResponse('DOUBLE_REPORT', 'Leitura do mês já realizada'),
            }
        }

        const measureUuid = uuidv4();
        const service = new GeminiService();

        const displayName = `${customer_code}_${measure_type}_${measure_datetime}`;
        const { measureValue, imageUrl } = await service.getMeasurementFromImage(image, displayName);

        const measure = new Measure();
        measure.measure_uuid = measureUuid;
        measure.customer_code = customer_code;
        measure.measure_datetime = measure_datetime;
        measure.measure_type = measure_type;
        measure.measure_value = parseInt(measureValue); 
        measure.image_url = imageUrl; 

        await measure.save();

        return {
            code: 200,
            response: {
                image_url: imageUrl,
                measure_value: measureValue,
                measure_uuid: measureUuid
            },
        };
    },
}

export default measureService;

