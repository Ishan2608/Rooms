import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = styled(Box)(({ issender }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: issender ? "flex-end" : "flex-start",
  margin: "10px 0",
}));

const MessageBubble = styled(Box)(({ issender }) => ({
  maxWidth: "70%",
  padding: "10px",
  borderRadius: "10px",
  backgroundColor: issender ? "#007aff" : "#444",
  color: "#fff",
  wordWrap: "break-word",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
}));

const MessageTimestamp = styled(Typography)(({ issender }) => ({
  fontSize: "0.8em",
  color: "#888",
  marginTop: "5px",
  textAlign: issender ? "right" : "left",
}));

const Message = ({ message }) => {
  const {user} = useAuthContext();
  console.log("Sender is: ");
  console.log(message.sender);
  const issender = String(message.sender._id) === String(user.id);

  return (
    <MessageContainer issender={issender}>
      <MessageBubble issender={issender}>
        {message.content && <Typography>{message.content}</Typography>}
        {message.file?.url && (
          <img src={message.file.url} alt="file" style={{ maxWidth: "100%" }} />
        )}
      </MessageBubble>
      <MessageTimestamp issender={issender}>
        {new Date(message.createdAt).toLocaleDateString()}
      </MessageTimestamp>
    </MessageContainer>
  );
};

export default Message;
