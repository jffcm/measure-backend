import ErrorResponse from "../response/ErrorResponse";

const createErrorResponse = (error_code: string, error_description: string): ErrorResponse => {
    return {
        error_code, 
        error_description
    };
};

export default createErrorResponse;