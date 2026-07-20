import { useState } from "react";

const useForm = (
  initialValues,
  validate
) => {
  const [values, setValues] =
    useState(initialValues);

  const [errors, setErrors] =
    useState({});

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const validateForm = () => {
    const validationErrors =
      validate(values);

    setErrors(validationErrors);

    return !Object.values(
      validationErrors
    ).some(Boolean);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    setErrors,
    handleChange,
    validateForm,
    resetForm,
    setValues,
  };
};

export default useForm;