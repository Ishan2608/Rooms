import React, { useState, useEffect } from "react";
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
import { useChatContext } from "../../context/ChatContext";
import { CHAT_ROUTES } from "../../api/constants";
import axios from "axios";

const SearchContacts = ({ onClose }) => {
  const { updateContacts, selectContact } = useChatContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    // Fetch all available users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get(CHAT_ROUTES.GET_ALL_USERS, {
          withCredentials: true, // Include cookies with the request
        });
        setFilteredContacts(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredContacts(
      filteredContacts.filter(
        (contact) =>
          contact.username.toLowerCase().includes(term) ||
          `${contact.firstName} ${contact.lastName}`
            .toLowerCase()
            .includes(term)
      )
    );
  };

  // Handle send button click
  const handleSendClick = async (contactId) => {
    try {
      // Add the selected contact to the user's contact list
      await axios.post(
        CHAT_ROUTES.ADD_TO_CONTACT,
        { contactId: String(contactId) }, // Ensuring contactId is a string
        { withCredentials: true }
      );

      // Fetch the updated contact list
      const response = await axios.get(CHAT_ROUTES.GET_ALL_CONTACTS, {
        withCredentials: true,
      });
      updateContacts(response.data);

      // Select the newly added contact
      const newContact = filteredContacts.find(
        (contact) => contact._id === contactId
      );
      selectContact(newContact);

      onClose(); // Close the modal
    } catch (error) {
      if (error.response) {
        console.error("Error adding contact:", error.response.data);
      } else {
        console.error("Error adding contact:", error.message);
      }
    }
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
              <ListItemText
                primary={contact.username} // Show the username as the main text
                secondary={`${contact.firstName} ${contact.lastName}`} // Show the full name as a light subheading
                secondaryTypographyProps={{
                  sx: {
                    color: "#b0b0b0", // Light grey color for subheading
                    fontSize: "0.875rem", // Adjust font size as needed
                  },
                }}
              />
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
