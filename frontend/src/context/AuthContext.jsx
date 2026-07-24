import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
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
    const response = await authService.login(payload);
    const { user, accessToken, refreshToken } = response.data;
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return response;
  };

  const register = async (payload) => {
    return authService.register(payload);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
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
    localStorage.setItem("user", JSON.stringify(response.data));
    setUser(response.data);
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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);