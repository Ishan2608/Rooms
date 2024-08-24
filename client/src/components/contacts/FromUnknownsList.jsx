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
  const {
    unknownMessages,
    updateUnknownMessages
  } = useChatContext(); // Access global state
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUnknownMessages = async () => {
      try {
        const response = await axios.get(CHAT_ROUTES.FETCH_UNKNOWN_MESSAGES, {
          withCredentials: true,
        });
        updateUnknownMessages(response.data);
      } catch (error) {
        console.error("Error fetching unknown messages:", error);
      }
    };

    fetchUnknownMessages();
    
  }, [updateUnknownMessages]);

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
              <Typography variant="body1">Loading contacts...</Typography>
            ) : unknownMessages.length === 0 ? (
              <Typography variant="body1">
                No messages from unknown users.
              </Typography>
            ) : (
              unknownMessages.map((message) => (
                <ContactCard
                  key={message._id}
                  image={message.sender.image}
                  username={message.sender.username}
                  onClick={() => handleContactClick(message.sender)}
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
