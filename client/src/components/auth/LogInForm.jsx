import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import Alert from "@mui/material/Alert";
import "../../index.css";

import axios from 'axios';
import { useAuthContext } from "../../context/AuthContext";
import { API_ROUTES } from '../../api/constants';

const LogInForm = () => {
  const { login, isAuthenticated } = useAuthContext();
  const nav = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      nav("/profile");
    }
  }, [isAuthenticated, nav]);

  const [logInForm, setLogInForm] = useState({
    email: "",
    password: "",
  });

  const [alertMsg, setAlertMsg] = useState(null);
  const [severity, setSeverity] = useState("error");

  const validateLogInForm = (logInForm) => {
    if (logInForm.email === "") {
      setAlertMsg("Email not specified");
      setSeverity("error");
      return false;
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      setAlertMsg("Email not Valid");
      setSeverity("error");
      return false;
    }
    if (logInForm.password === "") {
        setAlertMsg("Password not specified");
        setSeverity("error");
        return false;
      }
    setSeverity("success");
    setAlertMsg("logInForm has been submitted");
    return true;
  };

  const callLogInAPI = async (logInForm) => {
    const data = new FormData()
    data.append("email", logInForm.email);
    data.append("password", logInForm.password);
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      const response = await axios.post(API_ROUTES.LOG_IN, data, {
        headers:{
          "Content-Type": 'application/json'
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        const cookieToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwt="))
          ?.split("=")[1];
        login(response.data, cookieToken);
        nav("/profile");
      } else {
        setAlertMsg(response.data);
        setSeverity("error");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setAlertMsg(error.response.data);
          setSeverity("error");
        } else if (error.response.status === 404) {
          setAlertMsg(error.response.data);
          setSeverity("error");
        } else {
          setAlertMsg("Login failed");
          setSeverity("error");
        }
      } else {
        setAlertMsg("Login failed");
        setSeverity("error");
      }
    }
  };

  const handleLogIn = () => {
    const isLogInFormValid = validateLogInForm(logInForm);
    if (isLogInFormValid) {
      callLogInAPI(logInForm);
    } else {
      console.log("logInForm cannot be submitted");
    }
  };

  return (
    <div className="flex-col">
      {alertMsg && (
        <Alert variant="filled" severity={severity}>
          {" "}
          {alertMsg}{" "}
        </Alert>
      )}
      <TextField
        required
        id="outlined-required"
        name="email"
        label="Email"
        type="email"
        onChange={(e) => {
          setLogInForm({ ...logInForm, [e.target.name]: e.target.value });
        }}
      />
      <TextField
        required
        id="outlined-required"
        name="password"
        label="Password"
        type="password"
        onChange={(e) =>
          setLogInForm({ ...logInForm, [e.target.name]: e.target.value })
        }
      />
      <Button
        variant="contained"
        onClick={handleLogIn}
        sx={{ padding: "5px 0px 5px 0px" }}
      >
        Log In
      </Button>
    </div>
  );
}

export default LogInForm;
