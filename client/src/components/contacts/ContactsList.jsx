import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactGroupCard from "./ContactGroupCard"; // Ensure the path is correct

const ContactsList = () => {
  // Dummy data for contacts
  const contacts = [
    { _id: "1", username: "JohnDoe", image: "https://via.placeholder.com/50" },
    {
      _id: "2",
      username: "JaneSmith",
      image: "https://via.placeholder.com/50",
    },
    {
      _id: "3",
      username: "AlexanderTheGreat",
      image: "https://via.placeholder.com/50",
    },
    {
      _id: "4",
      username: "EmilyJohnson",
      image: "https://via.placeholder.com/50",
    },
    {
      _id: "5",
      username: "ChrisBrown",
      image: "https://via.placeholder.com/50",
    },
  ];

  // Function to truncate long usernames
  const truncateUsername = (username) => {
    return username.length > 10 ? `${username.slice(0, 10)}...` : username;
  };

  return (
    <Accordion
      defaultExpanded={false}
      sx={{
        backgroundColor: "#333",
        color: "#fff",
        marginBottom: "10px",
        boxShadow: "none",
        border: "none",
      }}
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
          maxHeight: "calc(100vh - 150px)", // Adjust based on header size and footer (if any)
        }}
      >
        <Box>
          {contacts.map((contact) => (
            <ContactGroupCard
              key={contact._id}
              image={contact.image}
              username={truncateUsername(contact.username)}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ContactsList;
