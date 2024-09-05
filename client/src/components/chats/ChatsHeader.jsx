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
    blockUser,
    addUnknownToContacts,
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

  const handleDeleteContact = async () => {
    try {
      if (!selectedContact) return;
      const url = `${CHAT_ROUTES.DELETE_A_CONTACT}/${selectedContact._id}`;
      const response = await axios.delete(url, { withCredentials: true });

      if (response.status === 200) {
        console.log("Contact deleted successfully:", response.data);

        // Fetch the updated contact list
        const updatedContactsResponse = await axios.get(
          CHAT_ROUTES.GET_ALL_CONTACTS,
          { withCredentials: true }
        );

        setContacts(updatedContactsResponse.data);
        selectContact(null);
      } else {
        console.error(
          "Failed to delete contact. Status code:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      handleMenuClose();
    }
  };

  const handleBlockUser = async () => {
    try {
      if (!selectedContact) return;

      await blockUser(selectedContact._id);

      selectContact(null);
    } catch (error) {
      console.error("Error blocking user:", error);
    } finally {
      handleMenuClose();
    }
  };

  const handleAddUnknownToContacts = async () => {
    try {
      if (!selectedContact) return;

      await addUnknownToContacts(selectedContact._id);

      selectContact(null);
    } catch (error) {
      console.error("Error adding unknown user to contacts:", error);
    } finally {
      handleMenuClose();
    }
  };

  const isUnknownUser =
    selectedContact &&
    unknownContacts.some((msg) => msg.sender === selectedContact._id);

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
            ) : (
              [
                <MenuItem
                  key="delete-contact"
                  onClick={handleDeleteContact}
                  sx={{ color: "red" }}
                >
                  Delete Contact
                </MenuItem>,
                <MenuItem
                  key="block-contact"
                  onClick={handleBlockUser}
                  sx={{ color: "orange" }}
                >
                  Block Contact
                </MenuItem>,
              ]
            )
          ) : null}
        </Menu>
      </HeaderContainer>
      <GroupInfo open={groupInfoOpen} onClose={handleCloseGroupInfo} />
    </>
  );
};

export default ChatsHeader;
