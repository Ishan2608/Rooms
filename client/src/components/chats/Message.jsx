import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = styled(Box)(({ isSender }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: isSender ? "flex-end" : "flex-start",
  margin: "10px 0",
}));

const MessageBubble = styled(Box)(({ isSender }) => ({
  maxWidth: "70%",
  padding: "10px",
  borderRadius: "10px",
  backgroundColor: isSender ? "#007aff" : "#444",
  color: "#fff",
  wordWrap: "break-word",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
}));

const MessageTimestamp = styled(Typography)(({ isSender }) => ({
  fontSize: "0.8em",
  color: "#888",
  marginTop: "5px",
  textAlign: isSender ? "right" : "left",
}));

const Message = ({ message }) => {
  const {user} = useAuthContext();
  const isSender = String(message.sender) === String(user.id);

  return (
    <MessageContainer isSender={isSender}>
      <MessageBubble isSender={isSender}>
        {message.content && <Typography>{message.content}</Typography>}
        {message.file?.url && (
          <img src={message.file.url} alt="file" style={{ maxWidth: "100%" }} />
        )}
      </MessageBubble>
      <MessageTimestamp isSender={isSender}>
        {new Date(message.createdAt).toLocaleTimeString()}
      </MessageTimestamp>
    </MessageContainer>
  );
};

export default Message;
