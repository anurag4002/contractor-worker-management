import { useState } from "react";
import { handleApiError } from "../utils/errorHandler";
import { toast } from "react-toastify";

/**
 * useFormErrors - manages only field-level and global API error state for forms.
 * Loading/submitting state is intentionally NOT managed here; each component
 * owns its own isSubmitting via useState to keep concerns separate and avoid
 * duplicate identifier errors when a component also pulls `loading` from a
 * data hook (usePayroll, useSites, useWorkers, etc.).
 */
const useFormErrors = () => {
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState("");

    const setFieldError = (field, message) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    const clearFieldError = (field) => {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const clearAllErrors = () => {
        setErrors({});
        setGlobalError("");
    };

    const handleError = (error) => {
        const { message, fieldErrors, status } = handleApiError(error);

        if (status === 401) {
            // Global 401 handling is done by the axios interceptor.
            // Set a local global error for in-form display if needed.
            setGlobalError("Session expired or invalid credentials.");
        } else if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            if (message && message !== "Validation Failed") {
                setGlobalError(message);
                toast.error(message);
            }
        } else {
            setGlobalError(message);
            toast.error(message);
        }
    };

    return {
        errors,
        setErrors,
        globalError,
        setGlobalError,
        setFieldError,
        clearFieldError,
        clearAllErrors,
        handleError,
    };
};

export default useFormErrors;
