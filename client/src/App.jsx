// Import React Methods and Components
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import your custom components
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import { useAuthContext, AuthProvider } from "./context/AuthContext";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? element : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/chat"
              element={<ProtectedRoute element={<Chat />} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
