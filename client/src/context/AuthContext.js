import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { API_ROUTES } from "../api/constants";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(API_ROUTES.GET_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const cookieToken = document.cookie.split("=")[1];
    if (cookieToken) {
      setToken(cookieToken);
      fetchUserData();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuthContext };
