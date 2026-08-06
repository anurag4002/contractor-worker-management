import { ToastContainer } from "react-toastify";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import "./Toast.css";

const toastIcons = {
  success: <CheckCircle2 size={20} strokeWidth={2.4} />,
  error: <XCircle size={20} strokeWidth={2.4} />,
  warning: <AlertTriangle size={20} strokeWidth={2.4} />,
  info: <Info size={20} strokeWidth={2.4} />,
};

const getTypeClass = (prefix, type) => `${prefix} ${prefix}--${type || "default"}`;

const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      closeButton
      theme="light"
      aria-live="polite"
      limit={3}
      icon={({ type }) => toastIcons[type] || toastIcons.info}
      toastClassName={({ type }) => getTypeClass("app-toast", type)}
      progressClassName={({ type }) => getTypeClass("app-toast-progress", type)}
    />
  );
};

export default Toast;
