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

const BlockedUsersList = () => {
  const {
    blockedUsers,
    updateBlockedUsers,
  } = useChatContext(); // Access global state
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchBlockedUsers = async () => {
      try {
        const response = await axios.get(CHAT_ROUTES.FETCH_BLOCKED_CONTACTS, {
          withCredentials: true,
        });
        updateBlockedUsers(response.data);
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      }
    };

    fetchBlockedUsers();
  }, [updateBlockedUsers]);

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
          aria-controls="blocked-content"
          id="blocked-header"
        >
          <Typography variant="h6">Blocked Users</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            maxHeight: "calc(100vh - 150px)",
          }}
        >
          <Box>
            {loading ? (
              <Typography variant="body1">Loading contacts...</Typography>
            ): blockedUsers.length === 0 ? (<Typography variant="body1">No blocked users.</Typography>
            ):(
              blockedUsers.map((user) => (
                <ContactCard
                  key={user._id}
                  image={user.image}
                  username={user.username}
                  onClick={() => handleContactClick(user)}
                />
              ))
            )}
            
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default BlockedUsersList;
