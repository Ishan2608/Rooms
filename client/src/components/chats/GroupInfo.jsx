import React from "react";
import {
  IconButton,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useChatContext } from "../../context/ChatContext";

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
  const { selectedGroup } = useChatContext();

  if (!selectedGroup) return null;

  return (
    <SliderContainer
      style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
    >
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      <Box>
        <Avatar
          src={selectedGroup.image}
          alt={selectedGroup.name}
          sx={{ width: 100, height: 100 }}
        />
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
        <Button variant="contained" color="secondary">
          Leave
        </Button>
        <Button variant="contained" color="error">
          Delete
        </Button>
      </Box>
    </SliderContainer>
  );
};

export default GroupInfo;
