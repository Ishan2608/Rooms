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

const GroupCard = ({ name, image, onClick }) => {
  return (
    <StyledCard onClick={onClick}>
      <Tooltip title={name}>
        <StyledAvatar src={image} alt={name} />
      </Tooltip>
      <CardContent>
        <Typography variant="body1" noWrap>
          {name}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default GroupCard;
