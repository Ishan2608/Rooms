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
  const {
    selectedContact,
    selectedGroup,
    selectContact,
    selectGroup,
    setContacts,
    unknownContacts,
    blockedUsers,
    setBlockedUsers,
    setUnknownContacts,
  } = useChatContext();

  const displayName = selectedContact
    ? selectedContact.username
    : selectedGroup
    ? selectedGroup.name
    : "Select a User";

  const displaySubName = selectedContact
    ? `${selectedContact.firstName} ${selectedContact.lastName}`
    : null;

  const displayImage = selectedContact
    ? `http://localhost:8747${selectedContact.image}`
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

  // Add unknown user to contacts
  const handleAddUnknownToContacts = async () => {
    try {
      if (!selectedContact) return;

      const url = `${CHAT_ROUTES.ADD_UNKNOWN_TO_CONTACTS}/${selectedContact._id}`;
      const response = await axios.post(url, {}, { withCredentials: true });

      if (response.status === 200) {
        console.log("User added to contacts successfully:", response.data);

        // Update contacts
        const updatedContactsResponse = await axios.get(
          CHAT_ROUTES.GET_ALL_CONTACTS,
          { withCredentials: true }
        );
        setContacts(updatedContactsResponse.data);

        // Remove user from unknown contacts
        setUnknownContacts((prev) =>
          prev.filter((user) => user._id !== selectedContact._id)
        );
      } else {
        console.error(
          "Failed to add user to contacts. Status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error adding user to contacts:", error);
    } finally {
      handleMenuClose();
    }
  };

  // Block a user
  const handleBlockUser = async () => {
    try {
      if (!selectedContact) return;

      const url = `${CHAT_ROUTES.BLOCK_USER}/${selectedContact._id}`;
      const response = await axios.post(url, {}, { withCredentials: true });

      if (response.status === 200) {
        console.log("User blocked successfully:", response.data);

        // Update blocked users
        setBlockedUsers((prev) => [...prev, selectedContact]);

        // Remove user from unknown contacts
        setUnknownContacts((prev) =>
          prev.filter((user) => user.sender !== selectedContact._id)
        );
      } else {
        console.error("Failed to block user. Status:", response.status);
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    } finally {
      handleMenuClose();
    }
  };

  // Unblock a user
  const handleUnblockUser = async () => {
    try {
      if (!selectedContact) return;

      const url = `${CHAT_ROUTES.UNBLOCK_USER}/${selectedContact._id}`;
      const response = await axios.post(url, {}, { withCredentials: true });

      if (response.status === 200) {
        console.log("User unblocked successfully:", response.data);

        // Update blocked users list by removing the unblocked user
        setBlockedUsers((prev) =>
          prev.filter((user) => user._id !== selectedContact._id)
        );

        // Optionally, update contacts if needed
        const updatedContactsResponse = await axios.get(
          CHAT_ROUTES.GET_ALL_CONTACTS,
          { withCredentials: true }
        );
        setContacts(updatedContactsResponse.data);
      } else {
        console.error("Failed to unblock user. Status:", response.status);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
    } finally {
      handleMenuClose();
    }
  };

  const isUnknownUser =
    selectedContact &&
    unknownContacts.some((user) => user._id === selectedContact._id);

  const isBlockedUser =
    selectedContact &&
    blockedUsers.some((user) => user._id === selectedContact._id);

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
              backgroundColor: "#424242",
              color: "#fff",
            },
          }}
        >
          {selectedGroup && !selectedContact ? (
            <MenuItem onClick={handleViewGroupInfo}>View Group Info</MenuItem>
          ) : selectedContact ? (
            isUnknownUser ? (
              [
                <MenuItem
                  key="add-to-contacts"
                  onClick={handleAddUnknownToContacts}
                >
                  Add to Contacts
                </MenuItem>,
                <MenuItem
                  key="block-user"
                  onClick={handleBlockUser}
                  sx={{ color: "orange" }}
                >
                  Block this user
                </MenuItem>,
              ]
            ) : isBlockedUser ? (
              <MenuItem
                key="unblock-user"
                onClick={handleUnblockUser}
                sx={{ color: "green" }}
              >
                Unblock Contact
              </MenuItem>
            ) : (
              <MenuItem
                key="block-contact"
                onClick={handleBlockUser}
                sx={{ color: "orange" }}
              >
                Block Contact
              </MenuItem>
            )
          ) : null}
        </Menu>
      </HeaderContainer>
      <GroupInfo open={groupInfoOpen} onClose={handleCloseGroupInfo} />
    </>
  );
};

export default ChatsHeader;
