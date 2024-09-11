import React, { createContext, useContext, useState, useCallback } from "react";

import axios from "axios";
import { CHAT_ROUTES } from "../api/constants";
// Create ChatContext
const ChatContext = createContext();

// Custom hook for easier context consumption
const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

// Provider component
const ChatProvider = ({ children }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [unknownContacts, setUnknownContacts] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  const selectContact = useCallback((contact) => {
    setSelectedContact(contact);
    setSelectedGroup(null); // Clear selected group when a contact is selected
    fetchChatMessages(contact);
  }, []);

  const selectGroup = useCallback((group) => {
    setSelectedGroup(group);
    setSelectedContact(null); // Clear selected contact when a group is selected
    fetchChatMessages(group);
  }, []);

  const updateContacts = useCallback((newContacts) => {
    setContacts(newContacts);
  }, []);

  const updateGroups = useCallback((newGroups) => {
    setGroups(newGroups);
  }, []);

  const updateUnknownContacts = useCallback((newUnknownContacts) => {
    setUnknownContacts(newUnknownContacts);
  }, []);

  const updateBlockedUsers = useCallback((newBlockedUsers) => {
    setBlockedUsers(newBlockedUsers);
  }, []);

 const fetchChatMessages = useCallback(async (chatEntity) => {
   if (!chatEntity) {
    return;
   }

   try {
     let url = "";
     if (selectedContact) {
      //  console.log(chatEntity._id);
       url = `${CHAT_ROUTES.FETCH_USER_CHAT_MESSAGES}/${chatEntity._id}`
     } else if (selectedGroup) {
      //  console.log(chatEntity._id);
       url = `${CHAT_ROUTES.FETCH_GROUP_CHAT_MESSAGES}/${chatEntity._id}`;
     }

     if (url) {
       const response = await axios.get(url, {withCredentials: true});
       setCurrentMessages(response.data);
     } else {
       setCurrentMessages([]);
     }
   } catch (error) {
     console.error("Error fetching chat messages:", error);
     setCurrentMessages([]); // Clear messages on error
   }
 }, [selectedContact, selectedGroup, blockedUsers, unknownContacts]);

  return (
    <ChatContext.Provider
      value={{
        contacts,
        selectedContact,
        groups,
        selectedGroup,
        currentMessages,
        unknownContacts,
        blockedUsers,
        setContacts,
        setUnknownContacts,
        setBlockedUsers,
        selectContact,
        selectGroup,
        updateContacts,
        updateUnknownContacts,
        updateGroups,
        updateBlockedUsers,
        setCurrentMessages,
        fetchChatMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, useChatContext };
