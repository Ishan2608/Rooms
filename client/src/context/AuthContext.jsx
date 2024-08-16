import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { API_ROUTES } from "../api/constants.js";

// Create AuthContext
const AuthContext = createContext();

// Create a custom hook for easier consumption of context
const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((userData, token) => {
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get(API_ROUTES.GET_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [token]);

  useEffect(() => {
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (cookieToken) {
      setToken(cookieToken);
      fetchUserData();
    }
  }, [fetchUserData]);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuthContext };
