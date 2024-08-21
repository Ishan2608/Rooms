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
import { useChatContext } from "../../context/ChatContext"; // Import useChatContext

const GroupsList = () => {
  const { selectGroup } = useChatContext(); // Access selectGroup from context

  // Dummy data for groups
  const groups = [
    {
      _id: "1",
      name: "Group Alpha",
      image: "https://via.placeholder.com/50",
    },
    {
      _id: "2",
      name: "Group Beta",
      image: "https://via.placeholder.com/50",
    },
    {
      _id: "3",
      name: "Group Gamma",
      image: "https://via.placeholder.com/50",
    },
    {
      _id: "4",
      name: "Group Delta",
      image: "https://via.placeholder.com/50",
    },
    {
      _id: "5",
      name: "Group Epsilon",
      image: "https://via.placeholder.com/50",
    },
  ];

  // Function to truncate long group names
  const truncatename = (name) => {
    return name.length > 10 ? `${name.slice(0, 10)}...` : name;
  };

  // Handle group click
  const handleGroupClick = (group) => {
    selectGroup(group); // Set selected group in the context
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
              key={group._id}
              image={group.image}
              name={truncatename(group.name)}
              onClick={() => handleGroupClick(group)} // Pass group to the click handler
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default GroupsList;
