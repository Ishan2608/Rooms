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

// Dummy data for contacts
const contacts = [
  { _id: "1", username: "JohnDoe" },
  { _id: "2", username: "JaneSmith" },
  { _id: "3", username: "AlexanderTheGreat" },
  { _id: "4", username: "EmilyJohnson" },
  { _id: "5", username: "ChrisBrown" },
  { _id: "6", username: "User 6" },
  { _id: "7", username: "User 7" },
  { _id: "8", username: "User 8" },
  { _id: "9", username: "User 9" },
  { _id: "10", username: "User 10" },
  // Add more items if needed
];

const FormGroup = ({ onClose }) => {
  const [groupTitle, setGroupTitle] = useState("");
  const [selectedContacts, setSelectedContacts] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Handle checkbox change
  const handleCheckboxChange = (contactId) => {
    setSelectedContacts((prev) => ({
      ...prev,
      [contactId]: !prev[contactId],
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Group Title:", groupTitle);
    console.log(
      "Selected Contacts:",
      Object.keys(selectedContacts).filter((id) => selectedContacts[id])
    );
    setOpenSnackbar(true);
    onClose();
    // Automatically close the modal when the toast appears
    // setTimeout(() => {
    //   onClose();
    // }, 600); 
    // Adjust timing if necessary
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

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Group created successfully!"
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
        sx={{ position: "absolute", top: 20, right: 20 }} // Adjust position to top right
      />
    </Box>
  );
};

export default FormGroup;
