import { mapAxiosError } from "./errorMapper";

export const handleApiError = (error) => {
    const mapped = mapAxiosError(error);

    return {
        message: mapped.userMessage,
        fieldErrors: mapped.fieldErrors,
        status: mapped.status,
    };
};
