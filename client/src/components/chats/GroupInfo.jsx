import React, { useState, useEffect } from "react";
import {
  IconButton,
  Button,
  Typography,
  Box,
  Avatar,
  TextField,
  Snackbar,
  Alert,
  Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

import axios from "axios";

import ContactCard from "../contacts/ContactCard";
import { useChatContext } from "../../context/ChatContext";
import { CHAT_ROUTES } from "../../api/constants";

import "../../index.css";
import { green, red } from "@mui/material/colors";
import { useAuthContext } from "../../context/AuthContext";

// Styled components
const SliderContainer = styled(Box)({
  position: "fixed",
  top: 0,
  right: 0,
  width: "350px",
  height: "100vh",
  backgroundColor: "#424242",
  color: "#fff",
  padding: "20px",
  boxShadow: "-2px 0 5px rgba(0,0,0,0.3)",
  transition: "transform 0.3s ease",
  transform: "translateX(0)",
  zIndex: 1300,
  overflowY: "auto", // Enable vertical scrolling
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
  color: "#fff",
});

const GroupInfo = ({ open, onClose }) => {
  const {user} = useAuthContext();
  const { selectedGroup, setSelectedGroup } = useChatContext();

  // Early return if no group is selected
  if (!selectedGroup) {
    return null; // or you can return a placeholder UI if desired
  }

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [groupName, setGroupName] = useState(selectedGroup?.name || "");
  const [groupDescription, setGroupDescription] = useState(
    selectedGroup?.description || "Set a Description"
  );
  const [groupImage, setGroupImage] = useState(selectedGroup?.image || `${selectedGroup.name}`);
  const [imageFile, setImageFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");

  // Delay rendering member list to allow global state update
  const [members, setMembers] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      setMembers(selectedGroup?.members || []);
    }, 500);
  }, [selectedGroup]);

  const handleImageUpload = (event) => {
    setChanged(true);
    setImageFile(event.target.files[0]);
  };

  const handleDeleteImage = () => {
    setGroupImage("");
    setChanged(true);
  };

  const handleSave = async () => {
    if (!groupName.trim()) {
      setSnackbarType("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", groupName);
      formData.append("description", groupDescription);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const updateGroupInfoUrl = CHAT_ROUTES.UPDATE_GROUP_INFO.replace(
        ":groupId",
        selectedGroup._id
      );

      const response = await axios.put(updateGroupInfoUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSelectedGroup(response.data);
      setSnackbarType("success");
    } catch (error) {
      console.error("Error updating group info:", error);
      setSnackbarType("error");
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  return (
    <SliderContainer
      style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
    >
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbarType} variant="filled" sx={{ width: "100%" }}>
          {snackbarType === "success"
            ? "Group info saved successfully"
            : "Error: Group name cannot be empty"}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={groupImage}
            alt={groupName}
            sx={{ width: 100, height: 100, mb: 1 }}
          />
          <Box>
            <IconButton component="label">
              <EditIcon />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </IconButton>
            <IconButton onClick={handleDeleteImage}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {isEditingName ? (
              <TextField
                fullWidth
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            ) : (
              groupName
            )}
          </Typography>
          <IconButton onClick={() => setIsEditingName(!isEditingName)}>
            <EditIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            {isEditingDescription ? (
              <TextField
                fullWidth
                multiline
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
              />
            ) : (
              groupDescription
            )}
          </Typography>
          <IconButton
            onClick={() => setIsEditingDescription(!isEditingDescription)}
          >
            <EditIcon />
          </IconButton>
        </Box>
        <Box>
          <Typography variant="h6">Members:</Typography>
          {members.length > 0 ? (
            members.map((member) => (
              <ContactCard
                key={member._id}
                username={member.username}
                image={false}
              />
            ))
          ) : (
            <Typography variant="body2">No members available</Typography>
          )}
        </Box>
        <Stack direction="column" spacing={2}>
          <Button
            variant="contained"
            sx={{ bgcolor: green[400] }}
            endIcon={<SendIcon />}
            disabled={!(isEditingDescription || isEditingName)}
          >
            Save
          </Button>
          <Button variant="contained" color="error" startIcon={<LogoutIcon />}>
            Leave
          </Button>
          <Button variant="contained" color="error" startIcon={<DeleteIcon />}
            disabled={user.id != selectedGroup.admin._id}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </SliderContainer>
  );
};

export default GroupInfo;
