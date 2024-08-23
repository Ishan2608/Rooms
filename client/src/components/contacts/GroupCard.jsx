import React from "react";
import { Card, CardContent, Avatar, Typography, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components for consistent design
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "10px",
  marginBottom: "10px",
  cursor: "pointer",
  backgroundColor: theme.palette.background.default,
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: "10px",
}));

const GroupCard = ({ groupName, image, onClick }) => {
  return (
    <StyledCard onClick={onClick}>
      <Tooltip title={groupName}>
        <StyledAvatar src={image} alt={groupName} />
      </Tooltip>
      <CardContent>
        <Typography variant="body1" noWrap>
          {groupName}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default GroupCard;
