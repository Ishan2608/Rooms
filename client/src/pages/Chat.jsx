import React from "react";
import ContactsContainer from "../components/contacts/ContactsContainer";
import ChatsContainer from "../components/chats/ChatsContainer";
import EmptyChatContainer from "../components/chats/EmptyChatContainer";
import { Box } from "@mui/material";

const Chat = () => {
  // Change to false to show ChatsContainer instead
  const empty = false; 

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
      }}
    >
      <ContactsContainer />
      <Box
        sx={{
          flex: 1, // Ensures it takes up the remaining space
          display: "flex",
          flexDirection: "column",
        }}
      >
        {empty ? <EmptyChatContainer /> : <ChatsContainer />}
      </Box>
    </Box>
  );
};

export default Chat;
