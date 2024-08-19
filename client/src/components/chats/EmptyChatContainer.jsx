import React from "react";
import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const EmptyChatContainer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: "#333", // Dark theme background
        color: "#fff",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <SearchIcon
        sx={{
          fontSize: 80, // Adjust the size as needed
          marginBottom: "20px",
        }}
      />
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Select a Contact or Channel
      </Typography>
      <Typography variant="body1">Send text, images, and files</Typography>
    </Box>
  );
};

export default EmptyChatContainer;
