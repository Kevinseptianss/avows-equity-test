/* eslint-disable react/prop-types */
// src/hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    if (token) {
      fetch(`${import.meta.env.VITE_URL_API}/auth`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: token,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Token validation failed");
          }
          return response.json();
        })
        .then((data) => {
          if (data.data.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken);
            setIsAuthenticated(true);
            navigate("/home");
          } else {
            console.error('Access token is undefined');
            setIsAuthenticated(false);
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Error validating token:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
        });
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    navigate("/home");
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
