import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useChatContext } from "../../context/ChatContext"; // Assuming this is where your global state is managed
import { CHAT_ROUTES } from "../../api/constants";
import axios from "axios";

const FormGroup = ({ onClose }) => {
  const { contacts, updateGroups, selectContact, selectGroup } =
    useChatContext();
  const [groupTitle, setGroupTitle] = useState("");
  const [selectedContacts, setSelectedContacts] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Handle checkbox change
  const handleCheckboxChange = (contactId) => {
    setSelectedContacts((prev) => ({
      ...prev,
      [contactId]: !prev[contactId],
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!groupTitle) {
      setSnackbarMessage("Group title is required!");
      setOpenSnackbar(true);
      return;
    }

    if (Object.keys(selectedContacts).length === 0) {
      setSnackbarMessage("At least one contact must be selected!");
      setOpenSnackbar(true);
      return;
    }

    try {
      // Prepare the data for group creation
      const selectedContactIds = Object.keys(selectedContacts).filter(
        (id) => selectedContacts[id]
      );
      const response = await axios.post(
        CHAT_ROUTES.CREATE_NEW_GROUP,
        { name: groupTitle, members: selectedContactIds },
        { withCredentials: true }
      );

      if (response.status === 201) {
        console.log("Group created successfully:", response.data);

        // Assuming response.data contains the newly created group
        const newGroup = response.data; // Adjust this line based on actual response structure

        // Optionally, fetch the updated list of groups if necessary
        // await fetchGroups();

        // Update the global state to include the new group
        updateGroups((prevGroups) => [...prevGroups, newGroup]);

        // Set the newly created group as selected
        selectGroup(newGroup);

        onClose(); // Close the modal
      } else {
        console.error("Failed to create group. Status code:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error creating group:", error.response.data);
      } else {
        console.error("Error creating group:", error.message);
      }
    }
  };


  // Close Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#424242",
        color: "#fff",
        height: "100%",
        maxHeight: "calc(100vh - 40px)", // Adjust height for modal padding
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with input and send button */}
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h6">Form a Group</Typography>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            label="Group Title"
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#007bff",
              color: "#fff",
              "&:hover": { backgroundColor: "#0056b3" },
            }}
          >
            Create
          </Button>
        </Box>
      </Box>

      {/* Contacts list with checkboxes */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "calc(100% - 80px)", // Adjust height considering header and padding
        }}
      >
        <Typography variant="subtitle1" sx={{ marginBottom: "10px" }}>
          Select Contacts
        </Typography>
        <List>
          {contacts.map((contact) => (
            <ListItem key={contact._id} sx={{ padding: "10px 0" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!selectedContacts[contact._id]}
                    onChange={() => handleCheckboxChange(contact._id)}
                    sx={{
                      color: "#fff",
                      "&.Mui-checked": { color: "#007bff" },
                    }}
                  />
                }
                label={<ListItemText primary={contact.username} />}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Snackbar for success or error message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          position: "absolute",
          top: 20,
          right: "50%",
          transform: "translateX(50%)",
        }} // Center horizontally
      />
    </Box>
  );
};

export default FormGroup;
