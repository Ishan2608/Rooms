// Import React Methods and Components
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Material UI Imports
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// Import your custom components
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
// Import Contexts
import { useAuthContext, AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
        },
      },
    },
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
              element={<ProtectedRoute element={
                  <ChatProvider>
                    <Chat/>
                  </ChatProvider>
                } />
              }
              // element={
              //     <ChatProvider>
              //       <Chat/>
              //     </ChatProvider>
              //   }
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
