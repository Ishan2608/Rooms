import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactCard from "./ContactCard";
import { useChatContext } from "../../context/ChatContext";
import axios from "axios";
import { CHAT_ROUTES } from "../../api/constants";

const ContactsList = () => {
  const { selectContact, contacts, setContacts, updateContacts } = useChatContext(); // Access global state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all contacts of the logged-in user
    const fetchContacts = async () => {
      try {
        const response = await axios.get(CHAT_ROUTES.GET_ALL_CONTACTS, {
          withCredentials: true,
        });
        // Debugging
        // console.log("Fetched Contacts:", response.data); 
        updateContacts(response.data); // Use the context method
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [setContacts]);

  // Handle contact click
  const handleContactClick = (contact) => {
    selectContact(contact); // Set selected contact in the context
  };

  // Truncate full name if too long
  const truncateFullName = (firstName, lastName) => {
    const fullName = `${firstName} ${lastName}`;
    return fullName.length > 15 ? `${fullName.slice(0, 15)}...` : fullName;
  };

  return (
    <Accordion
      defaultExpanded={false}
      sx={{ backgroundColor: "#333", color: "#fff", marginBottom: "10px" }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
        aria-controls="contacts-content"
        id="contacts-header"
      >
        <Typography variant="h6">Contacts</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          maxHeight: "calc(100vh - 150px)",
        }}
      >
        <Box>
          {loading ? (
            <Typography variant="body1">Loading contacts...</Typography>
          ) : contacts.length === 0 ? (
            <Typography variant="body1">No contacts found.</Typography>
          ) : (
            contacts.map((contact) => (
              <ContactCard
                key={contact._id}
                image={contact.image}
                username={contact.username} // Pass 'username'
                fullName={truncateFullName(contact.firstName, contact.lastName)} // Pass 'fullName'
                onClick={() => handleContactClick(contact)}
              />
            ))
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ContactsList;
