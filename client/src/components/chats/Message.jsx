import React, { useState } from "react";
import { Box, Typography, IconButton, LinearProgress } from "@mui/material";
import { styled } from "@mui/system";
import { useAuthContext } from "../../context/AuthContext";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import { HOST } from "../../api/constants";

import { downloadFile } from "../../utility/FireBaseMiddlewares";

const MessageContainer = styled(Box)(({ issender }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: issender ? "flex-end" : "flex-start",
  margin: "10px 0",
}));

const MessageBubble = styled(Box)(({ issender, ismedia }) => ({
  maxWidth: ismedia ? "80%" : "70%",
  padding: "10px",
  borderRadius: "10px",
  backgroundColor: issender ? "#007aff" : "#444",
  color: "#fff",
  wordWrap: "break-word",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
}));

const FileDetails = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginRight: "10px",
});

const MessageTimestamp = styled(Typography)(({ issender }) => ({
  fontSize: "0.8em",
  color: "#888",
  marginTop: "5px",
  textAlign: issender ? "right" : "left",
}));

const Message = ({ message }) => {
  const { user } = useAuthContext();
  const [downloadProgress, setDownloadProgress] = useState(null);
  const senderId = message.sender._id ? message.sender._id : message.sender;
  const issender = String(senderId) === String(user.id);

  const handleFileDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;

    // Display download progress (simulated)
    setDownloadProgress(0);
    const progressInterval = setInterval(() => {
      setDownloadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 100);

    setTimeout(() => {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadProgress(null); // Reset progress after download completes
    }, 1000); // Simulate 1-second download
  };

  const isMedia =
    message.file?.type?.startsWith("image/") ||
    message.file?.type?.startsWith("video/");

  return (
    <MessageContainer issender={issender}>
      <MessageBubble issender={issender} ismedia={isMedia}>
        {message.content && <Typography>{message.content}</Typography>}

        {message.file?.url && (
          <>
            {message.file.type.startsWith("image/") && (
              <img
                src={`${HOST}${message.file.url}`}
                alt={message.file.name}
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            )}

            {message.file.type.startsWith("video/") && (
              <video
                src={`${HOST}${message.file.url}`}
                controls
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            )}

            {!message.file.type.startsWith("image/") &&
              !message.file.type.startsWith("video/") && (
                <>
                  <FileDetails>
                    <FileIcon fontSize="large" />
                    <Typography variant="caption">
                      {message.file.name}
                    </Typography>
                  </FileDetails>
                  <IconButton
                    onClick={() =>
                      handleFileDownload(message.file.url, message.file.name)
                    }
                    color="primary"
                  >
                    <DownloadIcon />
                  </IconButton>
                </>
              )}
          </>
        )}
      </MessageBubble>

      {message.file?.url && downloadProgress !== null && (
        <LinearProgress
          variant="determinate"
          value={downloadProgress}
          sx={{ width: "90%", marginTop: "10px" }}
        />
      )}

      <MessageTimestamp issender={issender}>
        {new Date(message.createdAt).toLocaleDateString()}
      </MessageTimestamp>
    </MessageContainer>
  );
};

export default Message;
