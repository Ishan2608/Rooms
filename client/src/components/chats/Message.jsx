// import React from "react";
// import { Box, Typography } from "@mui/material";
// import { styled } from "@mui/system";
// import { useAuthContext } from "../../context/AuthContext";

// const MessageContainer = styled(Box)(({ issender }) => ({
//   display: "flex",
//   flexDirection: "column",
//   alignItems: issender ? "flex-end" : "flex-start",
//   margin: "10px 0",
// }));

// const MessageBubble = styled(Box)(({ issender }) => ({
//   maxWidth: "70%",
//   padding: "10px",
//   borderRadius: "10px",
//   backgroundColor: issender ? "#007aff" : "#444",
//   color: "#fff",
//   wordWrap: "break-word",
//   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
// }));

// const MessageTimestamp = styled(Typography)(({ issender }) => ({
//   fontSize: "0.8em",
//   color: "#888",
//   marginTop: "5px",
//   textAlign: issender ? "right" : "left",
// }));

// const Message = ({ message }) => {
//   const {user} = useAuthContext();
//   const senderId = message.sender._id ? message.sender._id : message.sender;
//   const issender = String(senderId) === String(user.id);
//   return (
//     <MessageContainer issender={issender}>
//       <MessageBubble issender={issender}>
//         {message.content && <Typography>{message.content}</Typography>}
//         {message.file?.url && (
//           <img src={message.file.url} alt="file" style={{ maxWidth: "100%" }} />
//         )}
//       </MessageBubble>
//       <MessageTimestamp issender={issender}>
//         {new Date(message.createdAt).toLocaleDateString()}
//       </MessageTimestamp>
//     </MessageContainer>
//   );
// };

// export default Message;

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { useAuthContext } from "../../context/AuthContext";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";

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
  display: "flex",
  alignItems: "center",
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
  console.log("Message is: ");
  console.log(message);
  const { user } = useAuthContext();
  const senderId = message.sender._id ? message.sender._id : message.sender;
  const issender = String(senderId) === String(user.id);

  const handleFileDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MessageContainer issender={issender}>
      <MessageBubble issender={issender}>
        {message.content && <Typography>{message.content}</Typography>}
        {message.file?.url && (
          <>
            <FileDetails>
              <FileIcon fontSize="large" />
              <Typography variant="caption">{message.file.name}</Typography>
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
      </MessageBubble>
      <MessageTimestamp issender={issender}>
        {new Date(message.createdAt).toLocaleDateString()}
      </MessageTimestamp>
    </MessageContainer>
  );
};

export default Message;
