import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import authService from "../services/auth.service";

const AuthRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState("/login");

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          setRedirectTo("/dashboard");
          return;
        }

        const response = await authService.checkAdmin();

        if (response.data.adminExists) {
          setRedirectTo("/login");
        } else {
          setRedirectTo("/register");
        }
      } catch (error) {
        console.error(error);
        setRedirectTo("/login");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "grid",
          placeItems: "center",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Loading...
      </div>
    );
  }

  return <Navigate to={redirectTo} replace />;
};

export default AuthRedirect;