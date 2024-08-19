import React, { useState } from "react";
import { TextField, IconButton, InputAdornment, Paper } from "@mui/material";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import EmojiPicker from "emoji-picker-react"; // Ensure this is installed

const SendMessageContainer = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleFileOpen = () => {
    document.getElementById("fileInput").click();
  };

  const handleSendMessage = () => {
    // Logic to send the message goes here
    console.log("Message sent:", message);
    setMessage("");
  };

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
