import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

// Imports from Material UI
import {
  Grid,
  TextField,
  Button,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import "../index.css";
import { API_ROUTES } from "../api/constants";

const steps = ["Set Email & Username", "Set Profile Pic", "Set Password"];
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const SignUpForm = () => {
  const { login, isAuthenticated } = useAuthContext();
  // Check if the user is already logged in
  if (isAuthenticated) {
    navigate("/profile");
  }
  const nav = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    image: null,
  });

  const [alertMsg, setAlertMsg] = useState(null);
  const [severity, setSeverity] = useState("error");
  const [imageSrc, setImageSrc] = useState(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setForm((prevForm) => ({
        ...prevForm,
        image: file,
      }));
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (form) => {
    if (form.email === "") {
      setSeverity("error");
      setAlertMsg("Email not specified");
      return false;
    }
    if (form.firstName === "") {
      setSeverity("error");
      setAlertMsg("First name not defined");
      return false;
    }
    if (form.lastName === "") {
      setSeverity("error");
      setAlertMsg("Last name not specified");
      return false;
    }
    if (form.username === "") {
      setSeverity("error");
      setAlertMsg("Username not specified");
      return false;
    }
    if (form.password === "") {
      setSeverity("error");
      setAlertMsg("Password not specified");
      return false;
    }
    if (form.password !== form.confirm_password) {
      setSeverity("error");
      setAlertMsg("Confirm Password Should be the same as Password");
      return false;
    }

    setSeverity("success");
    setAlertMsg("Form has been submitted");
    return true; // Return true if the form is valid
  };

  const callSignUpAPI = async (formData) => {
    try {
      const response = await axios.post(API_ROUTES.SIGN_UP, formData);
      if (response.status === 201) {
        const token = response.headers["set-cookie"][0].split("=")[1];
        login(response.data, token);
        nav("/chats");
      } else {
        setSeverity("error");
        setAlertMsg(`ERROR: ${response.data}`);
      }
    } catch (error) {
      if (error.response) {
        setSeverity("error");
        setAlertMsg(`ERROR: ${error.response.data}`);
      } else {
        setAlertMsg("Sign Up Failed");
        setSeverity("error");
      }
    }
  };

  const handleSignUp = () => {
    // Run validation and only proceed if it returns true
    const isFormValid = validateForm(form);
    if (isFormValid) {
      console.log("Form is Good to Go");
      callSignUpAPI(form);
    } else {
      console.log("Form cannot be submitted");
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <TextField
              required
              id="outlined-required"
              name="firstName"
              label="First Name"
              type="text"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
            />
            <TextField
              required
              id="outlined-required"
              name="lastName"
              label="Last Name"
              type="text"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
            />
            <TextField
              required
              id="outlined-required"
              name="email"
              label="Email"
              type="email"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
            />
          </Stack>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={2}>
                <TextField
                  required
                  id="outlined-required"
                  name="username"
                  label="Username"
                  type="text"
                  onChange={(e) =>
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }
                />

                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload a Profile Picture
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Uploaded Profile"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <p>No image uploaded yet</p>
              )}
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Stack spacing={2}>
            <TextField
              required
              id="outlined-required"
              name="password"
              label="Password"
              type="password"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
            />
            <TextField
              required
              id="outlined-required"
              name="confirm_password"
              label="Confirm Password"
              type="password"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
            />
          </Stack>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div className="flex-col">
      {alertMsg && (
        <Alert variant="filled" severity={severity}>
          {alertMsg}
        </Alert>
      )}

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div>
        {renderStepContent(activeStep)}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleSignUp}>
              Sign Up
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;

