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

  // Redirect if the user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      nav("/profile");
    }
  }, [isAuthenticated, nav]);

  const [loginForm, setloginForm] = useState({
    email: "",
    password: "",
  });

  const [alertMsg, setAlertMsg] = useState(null);
  const [severity, setSeverity] = useState("error");

  const validateloginForm = (loginForm) => {
    if (loginForm.email === "") {
      setAlertMsg("Email not specified");
      setSeverity("error");
      return false;
    }
    if (loginForm.password === "") {
      setAlertMsg("Password not specified");
      setSeverity("error");
      return false;
    }
    setSeverity("success");
    setAlertMsg("loginForm has been submitted");
    return true;
  };

  const callLogInAPI = async (loginForm) => {
    const data = new FormData()
    data.append("email", loginForm.email);
    data.append("password", loginForm.password);
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
    const isloginFormValid = validateloginForm(loginForm);
    if (isloginFormValid) {
      console.log("loginForm is Good to Go");
      console.log(loginForm);
      callLogInAPI(loginForm);
    } else {
      console.log("loginForm cannot be submitted");
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
          setloginForm({ ...loginForm, [e.target.name]: e.target.value });
        }}
      />
      <TextField
        required
        id="outlined-required"
        name="password"
        label="Password"
        type="password"
        onChange={(e) => setloginForm({ ...loginForm, [e.target.name]: e.target.value })}
      />
      <Button variant="contained" onClick={handleLogIn}>
        Log In
      </Button>
    </div>
  );
}

export default LogInForm;
