import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const dummyContacts = [
  { _id: "1", username: "JohnDoe" },
  { _id: "2", username: "JaneSmith" },
  { _id: "3", username: "AlexanderTheGreat" },
  { _id: "4", username: "EmilyJohnson" },
  { _id: "5", username: "ChrisBrown" },
  { _id: "6", username: "User 6" },
  { _id: "7", username: "User 7" },
  { _id: "7", username: "User 7" },
  { _id: "7", username: "User 7" },
  { _id: "7", username: "User 7" },
  { _id: "7", username: "User 7" },
  // Add more dummy contacts if needed
];

const SearchContacts = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(dummyContacts);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredContacts(
      dummyContacts.filter((contact) =>
        contact.username.toLowerCase().includes(term)
      )
    );
  };

  // Handle send button click
  const handleSendClick = (contactId) => {
    console.log("Send message to contact ID:", contactId);
    onClose(); // Close the modal
  };

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#424242",
        color: "#fff",
        height: "100%",
        maxHeight: "calc(100vh - 40px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with search input */}
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h6">Search for Contacts</Typography>
        <TextField
          variant="outlined"
          size="small"
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ marginTop: "10px", width: "100%" }}
        />
      </Box>

      {/* Contacts list */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        <List>
          {filteredContacts.map((contact) => (
            <ListItem key={contact._id} sx={{ padding: "10px 0" }}>
              <ListItemText primary={contact.username} />
              <IconButton
                onClick={() => handleSendClick(contact._id)}
                sx={{
                  color: "#007bff",
                  "&:hover": { color: "#0056b3" },
                }}
              >
                <SendIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SearchContacts;
