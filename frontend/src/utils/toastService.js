import { toast } from "react-toastify";
import { getFriendlyMessage } from "./errorMapper";

const activeToasts = new Set();

const dismiss = (message) => {
  activeToasts.delete(message);
};

export const showSuccess = (message) => {
  if (!message || activeToasts.has(message)) return;
  activeToasts.add(message);
  toast.success(message, {
    toastId: message,
    onClose: () => dismiss(message),
  });
};

export const showError = (errorOrMessage) => {
  if (errorOrMessage && typeof errorOrMessage === "object") {
    if (errorOrMessage._sessionExpiredHandled) {
      return;
    }
    console.error(errorOrMessage);
  }

  const message = getFriendlyMessage(errorOrMessage);

  if (!message || activeToasts.has(message)) return;
  activeToasts.add(message);
  toast.error(message, {
    toastId: message,
    onClose: () => dismiss(message),
  });
};

export const showWarning = (message) => {
  if (!message || activeToasts.has(message)) return;
  activeToasts.add(message);
  toast.warning(message, {
    toastId: message,
    onClose: () => dismiss(message),
  });
};

export const showInfo = (message) => {
  if (!message || activeToasts.has(message)) return;
  activeToasts.add(message);
  toast.info(message, {
    toastId: message,
    onClose: () => dismiss(message),
  });
};
