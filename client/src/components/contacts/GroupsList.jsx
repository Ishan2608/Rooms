import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupCard from "./GroupCard";
import { useChatContext } from "../../context/ChatContext"; // Import useChatContext
import axios from "axios";
import { CHAT_ROUTES } from "../../api/constants";

const GroupsList = () => {
  const {
    selectGroup,
    groups = [],
    updateGroups,
    selectedGroup,
  } = useChatContext(); // Default groups to empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch groups from the API
    const fetchGroups = async () => {
      try {
        const response = await axios.get(CHAT_ROUTES.GET_ALL_GROUPS, {
          withCredentials: true, // Include cookies with the request
        });
        updateGroups(response.data || []); // Ensure groups is an array
        setLoading(false);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setError("Failed to load groups");
        setLoading(false);
      }
    };

    fetchGroups();
  }, [updateGroups]);

  // Function to truncate long group names
  const truncateName = (name) => {
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
          {loading ? (
            <Typography>Loading groups...</Typography>
          ) : error ? (
            <Typography>{error}</Typography>
          ) : (
            groups.map((group) => (
              <GroupCard
                key={group._id}
                image={group.image}
                name={truncateName(group.name)}
                onClick={() => handleGroupClick(group)} // Pass group to the click handler
                sx={{
                  backgroundColor:
                    selectedGroup?._id === group._id ? "#555" : "transparent",
                }} // Highlight selected group
              />
            ))
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default GroupsList;
