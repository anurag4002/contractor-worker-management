import { useState } from "react";
import { handleApiError } from "../utils/errorHandler";
import { showError } from "../components/common/toast";

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
        if (error && typeof error === "object" && error._sessionExpiredHandled) {
            return;
        }

        const { message, fieldErrors, status } = handleApiError(error);

        if (status === 401) {
            setGlobalError("Your session has expired. Please log in again to continue.");
        } else if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            if (message) {
                setGlobalError(message);
                showError(message);
            }
        } else {
            setGlobalError(message);
            showError(message);
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
