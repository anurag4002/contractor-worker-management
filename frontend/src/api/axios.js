import axios from "axios";
import { showError } from "../utils/toastService";
import { getFriendlyMessage } from "../utils/errorMapper";

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh-token",
];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicAuth = PUBLIC_AUTH_PATHS.some((path) =>
      config.url?.startsWith(path)
    );

    if (isPublicAuth) {
      if (config.headers) {
        delete config.headers.Authorization;
      }
      return config;
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("authToken");

    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.error(error);

    const originalRequest = error.config;

    const isPublicAuth = PUBLIC_AUTH_PATHS.some((path) =>
      originalRequest.url?.startsWith(path)
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isPublicAuth) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("Refresh token missing");
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {
            refreshToken,
          }
        );

        const {
          accessToken,
          refreshToken: newRefreshToken,
        } = response.data.data;

        localStorage.setItem(
          "token",
          accessToken
        );

        localStorage.setItem(
          "refreshToken",
          newRefreshToken
        );

        if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
          originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
        } else {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        const markedError = new Error(refreshError.message);
        Object.assign(markedError, refreshError);
        markedError._sessionExpiredHandled = true;

        showError("Your session has expired. Please log in again to continue.");

        setTimeout(() => {
          window.location.href = "/login";
        }, 300);

        return Promise.reject(markedError);
      }
    }

    const friendlyMessage = getFriendlyMessage(error);
    showError(friendlyMessage);

    return Promise.reject(error);
  }
);

export default axiosInstance;
