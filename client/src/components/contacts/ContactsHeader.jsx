import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Modal,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SearchContacts from "./SearchContacts"; // Import the SearchContacts modal
import FormGroup from "./FormGroup"; // Import the FormGroup modal

const ContactsHeader = () => {
  const { isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(null);

  // Redirect if the user is not authenticated
  // React.useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/auth");
  //   }
  // }, [isAuthenticated, navigate, user]);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOptionClick = (option) => {
    setAnchorEl(null); // Close the dropdown menu
    if (option === "search") {
      setOpenModal("searchContacts");
    } else if (option === "group") {
      setOpenModal("formGroup");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(null); // Close the modal
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#424242",
      }}
    >
      <Avatar
        src={user?.profileImage || ""}
        alt={user?.name || "User"}
        onClick={handleProfileClick}
        style={{ cursor: "pointer" }}
      />
      <Typography
        variant="body1"
        style={{
          marginLeft: "10px",
          color: "#fff",
          flexGrow: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {user?.name || "User"}
      </Typography>
      <IconButton onClick={handleMenuClick} style={{ color: "#fff" }}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            backgroundColor: "#424242", // Adjusts the dropdown to match the dark theme
            color: "#fff",
            marginTop: "40px", // Adjusts position relative to the header
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleMenuOptionClick("search")}>
          Search a Contact
        </MenuItem>
        <MenuItem onClick={() => handleMenuOptionClick("group")}>
          Form a Group
        </MenuItem>
      </Menu>
      {/* Modal for Search Contacts */}
      <Modal
        open={openModal === "searchContacts"}
        onClose={handleCloseModal}
        aria-labelledby="search-contacts-modal"
        aria-describedby="modal-to-search-contacts"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: "none",
            backgroundColor: "#333", // Dark theme modal background
          }}
        >
          <SearchContacts onClose={handleCloseModal}/>
        </Box>
      </Modal>
      {/* Modal for Form Group */}
      <Modal
        open={openModal === "formGroup"}
        onClose={handleCloseModal}
        aria-labelledby="form-group-modal"
        aria-describedby="modal-to-form-group"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: "none",
            backgroundColor: "#333", // Dark theme modal background
          }}
        >
          <FormGroup onClose={handleCloseModal} />
        </Box>
      </Modal>
    </div>
  );
};

export default ContactsHeader;
