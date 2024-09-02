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
  const { selectedGroup, setSelectedGroup } = useChatContext();
  const { socket } = useSocketContext();

  if (!selectedGroup) {
    return null;
  }

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [groupName, setGroupName] = useState(selectedGroup?.name || "No Name");
  const [groupDescription, setGroupDescription] = useState(
    selectedGroup?.description || "Set a Description"
  );
  const [groupImage, setGroupImage] = useState(
    selectedGroup?.image || `${selectedGroup.name}`
  );
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

  useEffect(() => {
    const handleGroupInfoUpdated = (updatedGroup) => {
      setSelectedGroup(updatedGroup);
      setSnackbarType("success");
      setOpenSnackbar(true);
    };

    const handleGroupMemberLeft = ({ groupId, userId }) => {
      if (groupId === selectedGroup._id) {
        console.log(`User ${userId} left the group ${groupId}`);
        if (userId === user.id) {
          updateGroups((prevGroups) =>
            prevGroups.filter((group) => group._id !== groupId)
          );
          setSelectedGroup(null);
          setCurrentMessages([]);
          console.log("You have left the group.");
        } else {
          updateGroups((prevGroups) =>
            prevGroups.map((group) =>
              group._id === groupId
                ? {
                    ...group,
                    members: group.members.filter(
                      (member) => member._id !== userId
                    ),
                  }
                : group
            )
          );
        }
      }
    };

    const handleGroupDeleted = (groupId) => {
      if (groupId === selectedGroup._id) {
        console.log(`Group ${groupId} has been deleted`);
        updateGroups((prevGroups) =>
          prevGroups.filter((group) => group._id !== groupId)
        );
        setSelectedGroup(null);
        setCurrentMessages([]);
        console.log("The group has been deleted.");
      }
    };

    socket.on("groupInfoUpdated", handleGroupInfoUpdated);
    socket.on("groupMemberLeft", handleGroupMemberLeft);
    socket.on("groupDeleted", handleGroupDeleted);

    return () => {
      socket.off("groupInfoUpdated", handleGroupInfoUpdated);
      socket.off("groupMemberLeft", handleGroupMemberLeft);
      socket.off("groupDeleted", handleGroupDeleted);
    };
  }, [selectedGroup, user.id, setSelectedGroup]);

  const handleImageUpload = (event) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setGroupImage(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleDeleteImage = () => {
    setGroupImage("");
  };

  const handleSave = () => {
    if (!groupName.trim()) {
      setSnackbarType("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const imageBase64 = imageFile ? imageFile.toString("base64") : "";
      socket.emit("updateGroupInfo", {
        id: selectedGroup._id,
        name: groupName,
        description: groupDescription,
        imageFile: imageBase64,
      });
    } catch (error) {
      console.error("Error updating group info:", error);
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  const handleLeaveGroup = () => {
    if (!selectedGroup) return;

    socket.emit("leaveGroup", {
      groupId: selectedGroup._id,
      userId: user.id,
    });
  };

  const handleDeleteGroup = () => {
    if (!selectedGroup) return;

    if (user.id === selectedGroup.admin._id) {
      socket.emit("deleteGroup", {
        groupId: selectedGroup._id,
      });
    } else {
      console.log("You are not authorized to delete the Group");
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
