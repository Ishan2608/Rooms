// Import React Methods and Components
import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

// Import your custom components
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// Import Globals

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<Auth/>} />
          <Route path='/chat' element={<Chat/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='*' element={ < Navigate to="/auth" /> } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
