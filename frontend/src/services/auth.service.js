import axios from "../api/axios";

const authService = {
  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */

  checkAdmin: async () => {
    const { data } = await axios.get(
      "/auth/check-admin"
    );

    return data;
  },

  login: async (payload) => {
    const { data } = await axios.post(
      "/auth/login",
      payload
    );

    return data;
  },

  register: async (payload) => {
    const { password, ...rest } = payload;
    console.log("[Auth] Registration payload:", {
      ...rest,
      password: password ? "[REDACTED]" : undefined,
    });

    try {
      console.log("[Auth] Sending POST /auth/register");
      console.log("[Auth] axios baseURL:", axios.defaults.baseURL);
      const { data } = await axios.post(
        "/auth/register",
        payload
      );

      console.log("[Auth] Registration success:", data);
      return data;
    } catch (error) {
      console.error("[Auth] Registration error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config ? {
          method: error.config.method,
          url: error.config.url,
          baseURL: error.config.baseURL,
        } : null,
      });
      throw error;
    }
  },

  logout: async () => {
    const { data } = await axios.post(
      "/auth/logout"
    );

    return data;
  },

  refreshToken: async (refreshToken) => {
    const { data } = await axios.post(
      "/auth/refresh-token",
      {
        refreshToken,
      }
    );

    return data;
  },

  /*
  |--------------------------------------------------------------------------
  | Password
  |--------------------------------------------------------------------------
  */

  forgotPassword: async (email) => {
    const { data } = await axios.post(
      "/auth/forgot-password",
      {
        email,
      }
    );

    return data;
  },

  resetPassword: async (token, password) => {
    const { data } = await axios.post(
      "/auth/reset-password",
      {
        token,
        password,
      }
    );

    return data;
  },

  changePassword: async (
    oldPassword,
    newPassword
  ) => {
    const { data } = await axios.post(
      "/auth/change-password",
      {
        oldPassword,
        newPassword,
      }
    );

    return data;
  },

  /*
  |--------------------------------------------------------------------------
  | Profile
  |--------------------------------------------------------------------------
  */

  getProfile: async () => {
    const { data } = await axios.get(
      "/auth/profile"
    );

    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await axios.put(
      "/auth/profile",
      payload
    );

    return data;
  },
};

export default authService;