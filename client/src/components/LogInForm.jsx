import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import Alert from "@mui/material/Alert";

import "../index.css";

const LogInForm = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [alertMsg, setAlertMsg] = useState(null);
  const [severity, setSeverity] = useState("error");

  const validateForm = (form) => {
    if (form.email === "") {
      setAlertMsg("Email not specified");
      setSeverity("error");
      return false;
    }
    if (form.password === "") {
      setAlertMsg("Password not specified");
      setSeverity("error");
      return false;
    } 
    setSeverity("success");
    setAlertMsg("Form has been submitted");
    return true;
  };

  const handleLogIn = () => {
    const isFormValid = validateForm(form);
    if (isFormValid) {
      console.log("Form is Good to Go");
      console.log(form);
      nav("/profile");
    } else {
      console.log("Form cannot be submitted");
    }
  };

  return (
    <div className="flex-col">
      {alertMsg && ( <Alert variant="filled" severity={severity}> {alertMsg} </Alert> )}
      <TextField
        required
        id="outlined-required"
        name="email"
        label="Email"
        type="email"
        onChange={(e) => {
          setForm({ ...form, [e.target.name]: e.target.value });
        }}
      />
      <TextField
        required
        id="outlined-required"
        name="password"
        label="Password"
        type="password"
        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
      />
      <Button variant="contained" onClick={handleLogIn}>
        Log In
      </Button>
    </div>
  );
}

export default LogInForm;
