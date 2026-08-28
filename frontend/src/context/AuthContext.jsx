import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('[AUTH DEBUG] Failed to parse stored user', e);
      }
    }

    return null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.info('[AUTH DEBUG] AuthContext init', {
      hasToken: !!user,
      tokenLength: (localStorage.getItem("token") || localStorage.getItem("accessToken") || "").length,
      tokenSource: localStorage.getItem("token") ? 'token' : localStorage.getItem("accessToken") ? 'accessToken' : localStorage.getItem("jwt") ? 'jwt' : localStorage.getItem("authToken") ? 'authToken' : null,
      hasStoredUser: !!localStorage.getItem("user"),
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdmin = async () => {
    try {
      const response = await authService.checkAdmin();
      return response.data.adminExists;
    } catch (error) {
      console.error(error);
      return true;
    }
  };

  const login = async (payload) => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("jwt");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.clear();

    const response = await authService.login(payload);
    const authPayload = response?.data?.data || response?.data || response || {};
    const { user, accessToken, refreshToken } = authPayload;

    if (accessToken) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("accessToken", accessToken);
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }

    return response;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    const authPayload = response?.data?.data || response?.data || response || {};
    const { user, accessToken, refreshToken } = authPayload;

    if (accessToken) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("accessToken", accessToken);
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }

    return response;
  };

   const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("jwt");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
    setUser(null);
  };

  const forgotPassword = async (email) => {
    return authService.forgotPassword(email);
  };

  const resetPassword = async (token, password) => {
    return authService.resetPassword(token, password);
  };

  const changePassword = async (oldPassword, newPassword) => {
    return authService.changePassword(oldPassword, newPassword);
  };

  const getProfile = async () => {
    return authService.getProfile();
  };

  const updateProfile = async (payload) => {
    const response = await authService.updateProfile(payload);
    const updatedUser = response?.data?.data || response?.data || response || {};

    if (updatedUser?.user) {
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
      setUser(updatedUser.user);
    } else if (updatedUser && typeof updatedUser === "object") {
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAdmin,
        forgotPassword,
        resetPassword,
        changePassword,
        getProfile,
        updateProfile,
        isAuthenticated: !!user || !!localStorage.getItem("token") || !!localStorage.getItem("accessToken"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);