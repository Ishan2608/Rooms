import React, { useState, useEffect } from "react";
import { TextField, IconButton, InputAdornment, Paper } from "@mui/material";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import EmojiPicker from "emoji-picker-react";
import { useChatContext } from "../../context/ChatContext";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";

const SendMessageContainer = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {user} = useAuthContext();

  const { selectedContact, currentMessages, setCurrentMessages } =
    useChatContext();
  const socket = useSocketContext();

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleFileOpen = () => {
    document.getElementById("fileInput").click();
  };

  const handleSendMessage = () => {
    if (message.trim() !== "" && selectedContact && socket) {
      const newMessage = {
        content: message,
        sender: user.id,
        recipient: selectedContact._id,
        type: "text",
        group: selectedContact.isGroup ? selectedContact._id : null,
      };

      // Emit the message to the server
      socket.emit("sendMessage", newMessage);

      // Update the frontend state with the message as sent
      setCurrentMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          isSender: true,
        },
      ]);
      setMessage("");
    }
  };

  useEffect(() => {
    if (socket) {
      // Listen for the messageReceived event from the server
      socket.on("messageReceived", (receivedMessage) => {
        // Update the frontend state with the received message
        if (
          receivedMessage.recipient === selectedContact._id ||
          receivedMessage.group === selectedContact._id
        ) {
          setCurrentMessages((prevMessages) => [
            ...prevMessages,
            receivedMessage,
          ]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("messageReceived");
      }
    };
  }, [socket, selectedContact, setCurrentMessages]);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <Paper
      elevation={3}
      style={{
        padding: "10px",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#424242", // Dark theme background
        color: "#ffffff", // Dark theme text color
        position: "relative",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        InputProps={{
          style: { color: "#ffffff" }, // Text color for dark theme
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                onClick={toggleEmojiPicker}
                style={{ color: "#ffffff" }}
              >
                <EmojiEmotionsOutlinedIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleFileOpen} style={{ color: "#ffffff" }}>
                <AttachFileIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#757575", // Border color for dark theme
            },
            "&:hover fieldset": {
              borderColor: "#ffffff", // Border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ffffff", // Border color when focused
            },
          },
        }}
      />
      <IconButton color="primary" onClick={handleSendMessage}>
        <SendIcon style={{ color: "#ffffff" }} />
      </IconButton>

      {showEmojiPicker && (
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "10px",
            zIndex: 1000,
          }}
        >
          <EmojiPicker theme="dark" onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <input
        id="fileInput"
        type="file"
        style={{ display: "none" }}
        onChange={(e) => console.log(e.target.files[0])} // Handle file selection
      />
    </Paper>
  );
};

export default SendMessageContainer;
