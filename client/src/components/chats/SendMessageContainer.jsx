import React, { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import EmojiPicker from "emoji-picker-react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useChatContext } from "../../context/ChatContext";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";
import { CHAT_ROUTES } from "../../api/constants";

// Firebase
// import { uploadFile } from "../../utility/FireBaseMiddlewares";

// Styles for modal and overlay
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "300px",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

const overlayStyle = {
  backdropFilter: "blur(3px)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
};

const SendMessageContainer = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null); // State for storing selected file
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false); // State to control file modal
  const [isSending, setIsSending] = useState(false);

  const { user } = useAuthContext();
  const { selectedContact, selectedGroup, setCurrentMessages } =
    useChatContext();
  const socket = useSocketContext();

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleFileOpen = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]); // Store selected file in state
      setShowFileModal(true); // Show modal when file is selected
    }
  };

  const handleSendMessage = async () => {
    if (isSending) return;
    setIsSending(true);

    if (message.trim() !== "" && !file && socket) {
      const newMessage = {
        sender: user.id,
        recipient: selectedContact ? selectedContact._id : null,
        content: message,
        group: selectedGroup ? selectedGroup._id : null,
        createdAt: Date.now(),
      };

      if (newMessage.group) {
        socket.emit("sendGroupMessage", newMessage);
      } else {
        socket.emit("sendMessage", newMessage);
      }

      setCurrentMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          issender: true,
        },
      ]);
      setMessage("");
    }

    setIsSending(false);
  };

  const handleSendFileMessage = async () => {
    if (isSending || !file) return;
    setIsSending(true);
    const createdAt = Date.now();

    const formData = new FormData();
    formData.append("sender", user.id);
    if (selectedContact) {
      formData.append("recipient", selectedContact._id);
    }
    if (selectedGroup) {
      formData.append("group", selectedGroup._id);
    }
    formData.append("file", file);
    formData.append("createdAt", createdAt);

    try {
      const response = await axios.post(
        CHAT_ROUTES.SEND_FILE_MESSAGE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const newMessage = response.data;
      setCurrentMessages((prevMessages) => [
        ...prevMessages,
        { ...newMessage, issender: true },
      ]);
      setFile(null); // Clear the file input
      setShowFileModal(false); // Close modal after sending
    } catch (error) {
      console.error("Error sending file message:", error);
    }

    setIsSending(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <>
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
                <IconButton
                  onClick={handleFileOpen}
                  style={{ color: "#ffffff" }}
                >
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
          onChange={handleFileChange} // Handle file selection
        />
      </Paper>

      {/* File Modal */}
      <Modal open={showFileModal} onClose={() => setShowFileModal(false)}>
        <Box sx={{ ...modalStyle, ...overlayStyle }}>
          <IconButton
            onClick={() => setShowFileModal(false)}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <CloseIcon />
          </IconButton>
          <FileIcon fontSize="large" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {file?.name}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSendFileMessage} // Call the new function for file messages
          >
            Send
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SendMessageContainer;
