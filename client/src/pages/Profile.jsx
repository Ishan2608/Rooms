import React, { useState, useRef } from "react";
import { 
  Box, Avatar, Button, Card, CardContent, IconButton, 
  TextField, Typography, Snackbar, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { deepPurple, green, red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { API_ROUTES } from "../api/constants";

const Profile = () => {
  // access global context
  const { user } = useAuthContext();
  // Navigate hook
  const navigate = useNavigate();

  // Initial user data
  const [userData, setUserData] = useState({user});

  // State for the profile picture and Snackbar
  const [profilePic, setProfilePic] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");

  // Reference to the hidden file input element
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, username, password } = userData;
    // Example validation: check if fields are not empty and email format is correct
    const isValid =
      firstName &&
      lastName &&
      email &&
      username &&
      password &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append("firstName", userData.firstName);
        formData.append("lastName", userData.lastName);
        formData.append("email", userData.email);
        formData.append("username", userData.username);
        formData.append("password", userData.password);
        if (profilePic) {
          formData.append("image", profilePic);
        } else {
          formData.append("image", "");
        }

        const response = await axios.post(API_ROUTES.UPDATE_PROFILE, formData);

        if (response.status === 200) {
          console.log("User data saved:", userData);
          setSnackbarType("success");
        } else {
          setSnackbarType("error");
        }
      } catch (error) {
        console.error("Error saving user data:", error);
        setSnackbarType("error");
      }
    } else {
      setSnackbarType("error");
    }
    setOpenSnackbar(true);
  };

  const handleEditImage = () => {
    // Trigger the hidden file input element
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    // Read the selected file and set it as the profile picture
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfilePic(null);
  };

  const getInitials = () => {
    return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleBack = () => {
    navigate("/chat");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        overflowX: "hidden", // Ensure no horizontal overflow
        padding: 2,
      }}
    >
      {/* <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={
          snackbarType === "success"
            ? "Profile saved successfully"
            : "Please fill out all fields correctly"
        }
        action={
          <IconButton onClick={handleCloseSnackbar} color="inherit">
            <CloseIcon />
          </IconButton>
        }
      /> */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarType === "success"
            ? "Profile saved successfully"
            : "Please fill out all fields correctly"}
        </Alert>
      </Snackbar>
      <Card
        sx={{
          maxWidth: "100%",
          width: 400,
          p: 2,
          boxShadow: 3,
          margin: "auto",
          overflow: "hidden", // Prevent internal overflow
        }}
      >
        <CardContent
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }} // Position the back button
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ mb: 2 }}>
            <Avatar
              sx={{ bgcolor: deepPurple[500], width: 100, height: 100, mb: 1 }}
              src={profilePic}
              alt={getInitials()}
            >
              {!profilePic && getInitials()}
            </Avatar>
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around", // Adjust spacing of buttons
                width: "100%", // Ensure the buttons box fits the width of the parent
                mt: 1,
              }}
            >
              <IconButton onClick={handleEditImage}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDeleteImage}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="h6" component="div" sx={{ mb: 2 }}>
            {userData.firstName} {userData.lastName}
          </Typography>
          <TextField
            label="First Name"
            variant="outlined"
            required
            fullWidth
            sx={{ mb: 2 }}
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            required
            fullWidth
            sx={{ mb: 2 }}
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            required
            fullWidth
            sx={{ mb: 2 }}
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
          <TextField
            label="Username"
            variant="outlined"
            required
            fullWidth
            sx={{ mb: 2 }}
            name="username"
            value={userData.username}
            onChange={handleInputChange}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            required
            fullWidth
            sx={{ mb: 2 }}
            name="password"
            value={userData.password}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
