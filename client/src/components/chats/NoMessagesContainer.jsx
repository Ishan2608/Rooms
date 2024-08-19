import React from "react";
import { Box, Typography } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const NoMessagesContainer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: "#333",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <SentimentVeryDissatisfiedIcon
        sx={{ fontSize: 60, mb: 2, color: "#fff" }}
      />
      <Typography variant="h5" gutterBottom>
        No chat messages available
      </Typography>
      <Typography variant="body1">Send an emoji to your buddy.</Typography>
    </Box>
  );
};

export default NoMessagesContainer;
