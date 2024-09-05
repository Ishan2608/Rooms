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

const FromUnknownsList = () => {
  const { unknownContacts, selectContact, updateUnknownContacts } = useChatContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnknownContacts = async () => {
      try {
        const response = await axios.get(CHAT_ROUTES.FETCH_UNKNOWN_CONTACTS, {
          withCredentials: true,
        });
        setLoading(false);
        updateUnknownContacts(response.data);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching unknown users:", error);
      }
    };

    fetchUnknownContacts();
  }, [updateUnknownContacts]);

  const handleContactClick = (contact) => {
    selectContact(contact);
  };

  return (
    <>
      <Accordion
        defaultExpanded={false}
        sx={{ backgroundColor: "#333", color: "#fff", marginBottom: "10px" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
          aria-controls="unknown-content"
          id="unknown-header"
        >
          <Typography variant="h6">From Unknowns</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            maxHeight: "calc(100vh - 150px)",
          }}
        >
          <Box>
            {loading ? (
              <Typography variant="body1"> Loading... </Typography>
            ) : unknownContacts.length === 0 ? (
              <Typography variant="body1">
                No messages from unknown users.
              </Typography>
            ) : (
              unknownContacts.map((contact) => (
                <ContactCard
                  key={contact._id}
                  image={contact.image}
                  username={contact.username}
                  onClick={() => handleContactClick(contact)}
                />
              ))
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default FromUnknownsList;
