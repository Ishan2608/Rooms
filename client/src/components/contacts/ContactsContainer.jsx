import React from "react";
import { Box } from "@mui/material";
import ContactsHeader from "./ContactsHeader"; // Import the ContactsHeader component
import ContactsList from "./ContactsList"; // Import the ContactsList component
import GroupsList from "./GroupsList"; // Import the GroupsList component
import FromUnknownsList from "./FromUnknownsList";
import BlockedUsersList from "./BlockedUsersList";

const ContactsContainer = () => {
  return (
    <Box
      sx={{
        width: "25%", // Adjust width as needed
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#424242",
        color: "#fff",
      }}
    >
      <ContactsHeader />
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
        }}
      >
        <ContactsList />
        <GroupsList />
        <FromUnknownsList/>
        <BlockedUsersList/>
      </Box>
    </Box>
  );
};

export default ContactsContainer;
