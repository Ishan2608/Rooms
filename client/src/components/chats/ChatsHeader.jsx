import React, { useState } from "react";
import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useChatContext } from "../../context/ChatContext";
import GroupInfo from "./GroupInfo";
import { CHAT_ROUTES } from "../../api/constants";
import axios from "axios";

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
  const { selectedContact, selectedGroup, selectContact, setContacts, selectGroup } = useChatContext();

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

  const handleDeleteContact = async () => {
    try {
      if (!selectedContact) return;

      // Prepare URL with contactId
      const url = CHAT_ROUTES.DELETE_A_CONTACT.replace(
        ":contactId",
        selectedContact._id
      );

      // Make API request to delete the contact
      const response = await axios.delete(url, { withCredentials: true });

      // Check if the response status is OK
      if (response.status === 200) {
        console.log("Contact deleted successfully:", response.data);

        // Fetch the updated contact list
        const updatedContactsResponse = await axios.get(
          CHAT_ROUTES.GET_ALL_CONTACTS,
          {
            withCredentials: true,
          }
        );

        // Update local state to reflect the contact deletion
        setContacts(updatedContactsResponse.data);

        // Clear the selected contact
        selectContact(null);
      } else {
        console.error(
          "Failed to delete contact. Status code:",
          response.status
        );
      }
    } catch (error) {
      // Log the error
      console.error("Error deleting contact:", error);
    } finally {
      // Close the menu regardless of success or failure
      handleMenuClose();
    }
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
