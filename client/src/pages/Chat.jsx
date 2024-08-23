import React, {useEffect} from "react";
import ContactsContainer from "../components/contacts/ContactsContainer";
import ChatsContainer from "../components/chats/ChatsContainer";
import EmptyChatContainer from "../components/chats/EmptyChatContainer";
import { Box } from "@mui/material";
import { useChatContext } from "../context/ChatContext";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const {isAuthenticated, user} = useAuthContext();
  const navigate = useNavigate();
  const { selectedContact, selectedGroup } = useChatContext();
  // Redirect if the user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate, user]);

  // Show empty container if no contact or group is selected
  const empty = !selectedContact && !selectedGroup;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
      }}
    >
      <ContactsContainer />
      <Box
        sx={{
          flex: 1, // Ensures it takes up the remaining space
          display: "flex",
          flexDirection: "column",
        }}
      >
        {empty ? <EmptyChatContainer /> : <ChatsContainer />}
      </Box>
    </Box>
  );
};

export default Chat;
