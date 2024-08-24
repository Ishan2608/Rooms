import React, { createContext, useContext, useState, useCallback } from "react";

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
  const [unknownMessages, setUnknownMessages] = useState([]);
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

  const updateUnknownMessages = useCallback((newUnknownMessages) => {
    setUnknownMessages(newUnknownMessages);
  }, []);

  const updateBlockedUsers = useCallback((newBlockedUsers) => {
    setBlockedUsers(newBlockedUsers);
  }, []);

  const fetchChatMessages = useCallback(async (chatEntity) => {
    try {
      const messages = [];
      setCurrentMessages(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setCurrentMessages([]); // Clear messages on error
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        contacts,
        selectedContact,
        groups,
        selectedGroup,
        currentMessages,
        unknownMessages,
        blockedUsers,
        setContacts,
        setBlockedUsers,
        selectContact,
        selectGroup,
        updateContacts,
        updateGroups,
        updateUnknownMessages,
        updateBlockedUsers,
        setCurrentMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, useChatContext };
