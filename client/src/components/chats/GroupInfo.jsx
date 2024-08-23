import React, { useState } from "react";
import {
  IconButton,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { useChatContext } from "../../context/ChatContext";
import axios from "axios";
import { CHAT_ROUTES } from "../../api/constants";

// Styled components
const SliderContainer = styled(Box)({
  position: "fixed",
  top: 0,
  right: 0,
  width: "300px",
  height: "100vh",
  backgroundColor: "#424242",
  color: "#fff",
  padding: "20px",
  boxShadow: "-2px 0 5px rgba(0,0,0,0.3)",
  transition: "transform 0.3s ease",
  transform: "translateX(0)",
  zIndex: 1300, // Make sure it is on top
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
  color: "#fff",
});

const GroupInfo = ({ open, onClose }) => {
  const { selectedGroup, setSelectedGroup } = useChatContext();
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(selectedGroup?.name || "");
  const [groupDescription, setGroupDescription] = useState(
    selectedGroup?.description || ""
  );
  const [groupImage, setGroupImage] = useState(selectedGroup?.image || "");
  const [imageFile, setImageFile] = useState(null);

  if (!selectedGroup) return null;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]);
    // Preview or handle image file if needed
  };

  const handleDeleteImage = () => {
    setGroupImage(""); // Set image URL to empty string
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", groupName);
      formData.append("description", groupDescription);
      formData.append("image", imageFile || groupImage); // Include the file if it exists

      // Construct the URL with the group ID
      const updateGroupInfoUrl = CHAT_ROUTES.UPDATE_GROUP_INFO.replace(
        ":groupId",
        selectedGroup._id
      );

      // Make API request to update group info
      const response = await axios.put(updateGroupInfoUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the selected group in global state
      setSelectedGroup(response.data);

      // Close the editing mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating group info:", error);
    }
  };

  return (
    <SliderContainer
      style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
    >
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      <Box>
        {isEditing ? (
          <Box>
            <Avatar
              src={groupImage}
              alt={groupName}
              sx={{ width: 100, height: 100 }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<EditIcon />}
            >
              Upload
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteImage}
            >
              Remove
            </Button>
            <TextField
              fullWidth
              label="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Group Description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mt: 2 }}
            >
              Save
            </Button>
          </Box>
        ) : (
          <Box>
            <Avatar
              src={selectedGroup.image}
              alt={selectedGroup.name}
              sx={{ width: 100, height: 100 }}
            />
            <Box>
              <IconButton onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Group Info
              </Button>
            </Box>
            <Typography variant="h5">{selectedGroup.name}</Typography>
            <Typography variant="body2">{selectedGroup.description}</Typography>
            <Typography variant="subtitle1">Members:</Typography>
            {selectedGroup.members && selectedGroup.members.length > 0 ? (
              <List>
                {selectedGroup.members.map((member) => (
                  <ListItem key={member._id}>
                    <ListItemText
                      primary={`${member.firstName} ${member.lastName}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">No members available</Typography>
            )}
            {isEditing && (
              <Box>
                <Button variant="contained" color="secondary">
                  Leave
                </Button>
                <Button variant="contained" color="error">
                  Delete
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </SliderContainer>
  );
};

export default GroupInfo;
