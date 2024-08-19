import React from "react";
import { Box } from "@mui/material";
import SendMessageContainer from "./SendMessageContainer";
import ChatsHeader from "./ChatsHeader";
import ChatMessages from "./ChatMessages";

const ChatsContainer = () => {
  return (
    <Box
      sx={{
        flex: 1, // Takes up the remaining space
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#333", // Dark theme background
        color: "#fff",
      }}
    >
      {/* Header for chat */}
      <Box
        sx={{
          flexShrink: 0, // Prevent shrinking of the header
        }}
      >
        <ChatsHeader />
      </Box>

      {/* Container for chat messages */}
      <Box
        sx={{
          flex: 1, // Takes up remaining space
          overflowY: "auto", // Scrollable if content overflows
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end", // Align messages to the bottom
        }}
      >
        <ChatMessages />
      </Box>

      {/* Container for sending messages */}
      <Box
        sx={{
          flexShrink: 0, // Prevent shrinking of the input area
          padding: "10px",
          backgroundColor: "#444", // Slightly different background for contrast
        }}
      >
        <SendMessageContainer />
      </Box>
    </Box>
  );
};

export default ChatsContainer;
