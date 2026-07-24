export const handleApiError = (error) => {
    let message = "Something went wrong. Please try again later.";
    let fieldErrors = {};
    let status = null;

    if (error.response) {
        // The request was made and the server responded with a status code outside of the 2xx range
        status = error.response.status;
        const data = error.response.data;

        if (data) {
            if (data.message) {
                message = data.message;
            }
            if (data.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
                fieldErrors = data.errors;
            }
        }

        // Default messages for standard status codes if missing from backend
        if (!data || !data.message) {
            if (status === 400) message = "Bad Request";
            else if (status === 401) message = "Invalid credentials or session expired.";
            else if (status === 403) message = "You don't have permission to perform this action.";
            else if (status === 404) message = "Requested resource not found.";
            else if (status === 409) message = "Resource already exists.";
            else if (status === 422) message = "Validation failed.";
            else if (status === 429) message = "Too many requests. Please try again later.";
            else if (status >= 500) message = "Internal server error. Please try again later.";
        }
    } else if (error.request) {
        // The request was made but no response was received
        message = "Cannot connect to server. Please check your internet connection.";
    } else {
        // Something happened in setting up the request
        message = error.message || "An unexpected error occurred.";
    }

    return { message, fieldErrors, status };
};
