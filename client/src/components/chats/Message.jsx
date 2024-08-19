import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const MessageContainer = styled(Box)(({ isSender }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: isSender ? "flex-end" : "flex-start",
  marginBottom: "10px",
  width: "100%"
}));

const MessageBubble = styled(Box)(({ isSender }) => ({
  padding: "10px",
  borderRadius: "15px",
  backgroundColor: isSender ? "#1e88e5" : "#424242",
  color: isSender ? "#fff" : "#e0e0e0",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  display: "inline-block",
  maxWidth: "100%",
}));

const Message = ({ message }) => {
  const renderMessageContent = () => {
    switch (message.type) {
      case "text":
        return (
          <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
            {message.content}
          </Typography>
        );
      case "image":
        return (
          <img
            src={message.content}
            alt="Sent"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        );
      case "file":
        return (
          <Typography
            variant="body2"
            sx={{ color: "#e0e0e0", display: "flex", alignItems: "center" }}
          >
            <span>{message.fileName}</span>
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <MessageContainer isSender={message.isSender}>
      <MessageBubble isSender={message.isSender}>
        {renderMessageContent()}
      </MessageBubble>
    </MessageContainer>
  );
};

export default Message;
