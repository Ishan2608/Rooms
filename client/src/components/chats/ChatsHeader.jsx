import React from "react";
import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useChatContext } from "../../context/ChatContext";

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

const ChatsHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { selectedContact, selectedGroup, selectContact, selectGroup } =
    useChatContext();
  const displayName = selectedContact
    ? selectedContact.name
    : selectedGroup
    ? selectedGroup.name
    : "Select a User";

  const displayImage = selectedContact
    ? selectedContact.image
    : selectedGroup
    ? selectedGroup.image
    : null;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUnselect = () => {
    selectContact(null); // Clear selected contact
    selectGroup(null); // Clear selected group
  };

  const handleDeleteContact = () => {
    console.log("Delete Contact clicked");
    handleMenuClose();
  };

  return (
    <HeaderContainer>
      <IconButton
        onClick={handleUnselect}
        style={{ color: "#fff", marginRight: "10px" }}
      >
        <CloseIcon />
      </IconButton>
      <StyledAvatar src={displayImage} alt={displayName} />
      <Typography variant="h6" noWrap>
        {displayName}
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
            backgroundColor: "#DC143C",
            color: "#FFFFFF",
          },
        }}
      >
        <MenuItem onClick={handleDeleteContact}>Delete Contact</MenuItem>
      </Menu>
    </HeaderContainer>
  );
};

export default ChatsHeader;
