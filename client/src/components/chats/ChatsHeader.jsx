import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";

// Styled components
const HeaderContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "10px",
  backgroundColor: "#424242", // Dark theme background
  color: "#fff",
  borderBottom: "1px solid #333",
});

const StyledAvatar = styled(Avatar)({
  marginRight: "10px",
});

const ChatsHeader = ({ name, image }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteContact = () => {
    // Handle delete contact action here
    console.log("Delete Contact clicked");
    handleMenuClose();
  };

  return (
    <HeaderContainer>
      <StyledAvatar src={image} alt={name} />
      <Typography variant="h6" noWrap>
        Name of Contact
      </Typography>
      <div style={{ flexGrow: 1 }} />
      <IconButton onClick={handleMenuClick} style={{ color: "#fff" }}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            backgroundColor: "#424242",
            color: "#fff",
          },
        }}
      >
        <MenuItem onClick={handleDeleteContact} style={{ color: "#f44336" }}>
          Delete Contact
        </MenuItem>
      </Menu>
    </HeaderContainer>
  );
};

export default ChatsHeader;
