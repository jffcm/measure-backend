import SuccessResponse from "../response/SuccessResponse";

const createSuccessResponse = (): SuccessResponse => {
    return {
        success: true
    };
};

export default createSuccessResponse;