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
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useAuthContext } from "../../context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import { useSocketContext } from "../../context/SocketContext";
import ContactCard from "../contacts/ContactCard";
import { green, red } from "@mui/material/colors";
import { CHAT_ROUTES, HOST } from "../../api/constants";
import axios from "axios";

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
  overflowY: "auto",
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
  color: "#fff",
});

const GroupInfo = ({ open, onClose }) => {
  const { user } = useAuthContext();
  const { selectedGroup } = useChatContext();
  const socket = useSocketContext();

  if (!selectedGroup) {
    return null;
  }

  // States to track editing of details
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // States to track changes values of details
  const [groupName, setGroupName] = useState(selectedGroup.name);
  const [groupDescription, setGroupDescription] = useState( selectedGroup.description || "Set a Description" );
  const [groupImage, setGroupImage] = useState(
    selectedGroup.image ? `${HOST}${selectedGroup.image}` : ""
  );

  // States to track additional values
  const [members, setMembers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");

  // Store initial values
  const initialGroupName = selectedGroup.name;
  const initialGroupDescription = selectedGroup?.description || "Set a Description";
  const initialGroupImage = selectedGroup.image ? `${HOST}${selectedGroup.image}` : "";

  useEffect(() => {
    setTimeout(() => {
      setMembers(selectedGroup?.members || []);
    }, 500);
  }, [selectedGroup]);
  // Check if any field has changed from its initial value
  useEffect(() => {
    if (
      groupName !== initialGroupName ||
      groupDescription !== initialGroupDescription ||
      imageFile !== null ||
      groupImage !== initialGroupImage
    ) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [
    groupName, groupDescription, groupImage, imageFile,
    initialGroupName, initialGroupDescription, initialGroupImage,
  ]);

  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]);
    const reader = new FileReader();
    reader.onloadend = () => {
      setGroupImage(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleDeleteImage = () => {
    setGroupImage(null);
    setImageFile(null);
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

      const url = `${CHAT_ROUTES.UPLOAD_GROUP_IMAGE}/${selectedGroup._id}`;
      const res = await axios.put( url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        console.log(res.data.message);
      } else {
        console.error("Failed to upload image");
      }
      
      setSnackbarType("success");
      setOpenSnackbar(true);

    } catch (error) {
      console.error("Error updating group info:", error);
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  // Leaving the group
  const handleLeaveGroup = () => {
    if (selectedGroup) {
      // Emit the event to leave the group
      socket.emit("leaveGroup", { groupId: selectedGroup._id, userId: user.id });
      // Close the GroupInfo panel after leaving
      onClose(); 
    } else {
      console.error("No group selected");
    }
  };

  // Deleting the group
  const handleDeleteGroup = () => {
    if (selectedGroup && user.id === selectedGroup.admin._id) {
      // Emit the event to delete the group
      socket.emit("deleteGroup", selectedGroup._id);
      // Close the GroupInfo panel after deleting
      onClose(); 
    } else {
      console.error("You are not the admin or no group selected");
    }
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
            ? "Saved successfully"
            : "Error Occurred, Try Later."}
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
            members.map((member) => {
              const isAdmin = member._id.toString() === selectedGroup.admin._id.toString();
              return (
                <ContactCard
                  key={member._id}
                  username={member.username}
                  image={member.image}
                  sx={{
                    border: isAdmin ? "2px solid white" : "none",
                    padding: "4px",
                    borderRadius: "8px",
                  }}
                />
              );
            })
          ) : (
            <Typography variant="body2">No members available</Typography>
          )}
        </Box>
        <Stack direction="column" spacing={2}>
          <Button
            variant="contained"
            sx={{ bgcolor: green[400] }}
            endIcon={<SendIcon />}
            disabled={!isEditing}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLeaveGroup}
          >
            Leave
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={user.id !== selectedGroup.admin._id}
            onClick={handleDeleteGroup}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </SliderContainer>
  );
};

export default GroupInfo;
