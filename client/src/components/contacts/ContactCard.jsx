import React from "react";
import { Card, CardContent, Avatar, Typography, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { HOST } from "../../api/constants";

const StyledCard = styled(Card)(({ theme, sx }) => ({
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
  // Apply styling if custom styling provided
  border: sx?.border || "none",
  padding: sx?.padding || "10px",
  borderRadius: sx?.borderRadius || "4px",
  "&:hover": { backgroundColor: theme.palette.action.hover },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: "10px",
}));

const ContactCard = ({ username, fullName, image, onClick, sx }) => {
  const imageURL = `${HOST}${image}`;
  return (
    <StyledCard onClick={onClick} sx={sx}>
      <Tooltip title={username}>
        <StyledAvatar src={imageURL} alt={username} />
      </Tooltip>
      
      <CardContent>
        <Typography variant="body1" noWrap>
          {username}
        </Typography>
        <Typography variant="body2" color="textSecondary" noWrap>
          {fullName}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default ContactCard;
