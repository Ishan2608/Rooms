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
import axios from "axios";
import { useChatContext } from "../../context/ChatContext";

const SearchContacts = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const { selectContact } = useChatContext();

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/chat/users", {
          withCredentials: true, // Include cookies (JWT token)
        });
        setContacts(response.data);
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
      contacts.filter((contact) =>
        contact.username.toLowerCase().includes(term)
      )
    );
  };

  // Handle send button click
  const handleSendClick = async (contact) => {
    try {
      // Add the selected user to the current user's contacts
      await axios.post(
        "/api/chat/contact",
        { contactId: contact._id },
        { withCredentials: true } // Include cookies (JWT token)
      );

      // Update the selected contact in global state
      selectContact(contact);

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error adding contact:", error);
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
                primary={contact.username}
                secondary={`${contact.firstName} ${contact.lastName}`}
              />
              <IconButton
                onClick={() => handleSendClick(contact)}
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
