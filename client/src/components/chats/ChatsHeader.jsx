import React, { useState } from "react";
import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useChatContext } from "../../context/ChatContext";
import GroupInfo from "./GroupInfo";

// Styled components
const HeaderContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "10px",
  backgroundColor: "#424242",
  color: "#fff",
  borderBottom: "1px solid #333",
});

const StyledAvatar = styled(Avatar)({
  marginRight: "10px",
});

const ChatsHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [groupInfoOpen, setGroupInfoOpen] = useState(false);
  const { selectedContact, selectedGroup, selectContact, selectGroup } =
    useChatContext();

  const displayName = selectedContact
    ? selectedContact.username
    : selectedGroup
    ? selectedGroup.name
    : "Select a User";

  const displaySubName = selectedContact
    ? `${selectedContact.firstName} ${selectedContact.lastName}`
    : null;

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
    selectContact(null);
    selectGroup(null);
  };

  const handleViewGroupInfo = () => {
    setGroupInfoOpen(true);
    handleMenuClose();
  };

  const handleCloseGroupInfo = () => {
    setGroupInfoOpen(false);
  };

  const handleDeleteContact = () => {
    console.log("Delete Contact clicked");
    handleMenuClose();
  };

  return (
    <>
      <HeaderContainer>
        <IconButton
          onClick={handleUnselect}
          style={{ color: "#fff", marginRight: "10px" }}
        >
          <CloseIcon />
        </IconButton>
        <StyledAvatar src={displayImage} alt={displayName} />
        <div>
          <Typography variant="h6" noWrap>
            {displayName}
          </Typography>
          {displaySubName && (
            <Typography variant="subtitle2" noWrap sx={{ color: "#B0B0B0" }}>
              {displaySubName}
            </Typography>
          )}
        </div>
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
              backgroundColor: "#424242", // Change to match the header background
              color: "#fff", // Ensure text is readable
            },
          }}
        >
          {selectedGroup && !selectedContact ? (
            <MenuItem onClick={handleViewGroupInfo}>View Group Info</MenuItem>
          ) : selectedContact ? (
            <MenuItem onClick={handleDeleteContact} sx={{ color: "red" }}>
              Delete Contact
            </MenuItem>
          ) : null}
        </Menu>
      </HeaderContainer>
      <GroupInfo open={groupInfoOpen} onClose={handleCloseGroupInfo} />
    </>
  );
};

export default ChatsHeader;
