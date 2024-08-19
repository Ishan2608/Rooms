import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactGroupCard from "./ContactGroupCard"; // Ensure the path is correct

const GroupsList = () => {
  // Dummy data for groups
  const groups = [
    {
      _id: "1",
      groupName: "Group Alpha",
      image: "https://via.placeholder.com/50",
    },
    {
      _id: "2",
      groupName: "Group Beta",
      image: "https://via.placeholder.com/50",
    },
    {
      _id: "3",
      groupName: "Group Gamma",
      image: "https://via.placeholder.com/50",
    },
    {
      _id: "4",
      groupName: "Group Delta",
      image: "https://via.placeholder.com/50",
    },
    {
      _id: "5",
      groupName: "Group Epsilon",
      image: "https://via.placeholder.com/50",
    },
  ];

  // Function to truncate long group names
  const truncateGroupName = (groupName) => {
    return groupName.length > 10 ? `${groupName.slice(0, 10)}...` : groupName;
  };

  return (
      <Accordion
        defaultExpanded={false}
        sx={{ backgroundColor: "#333", color: "#fff", marginBottom: "10px" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
          aria-controls="groups-content"
          id="groups-header"
        >
          <Typography variant="h6">Groups</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            maxHeight: "calc(100vh - 150px)",
          }}
        >
          <Box>
            {groups.map((group) => (
              <ContactGroupCard
                username={truncateGroupName(group.groupName)} // Reusing `username` prop for group names
                key={group._id}
                image={group.image}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
  );
};

export default GroupsList;
