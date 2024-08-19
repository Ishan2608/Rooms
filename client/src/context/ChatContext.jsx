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
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [contacts, setContacts] = useState([]);

  const selectUser = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  const selectGroup = useCallback((group) => {
    setSelectedGroup(group);
  }, []);

  const updateContacts = useCallback((newContacts) => {
    setContacts(newContacts);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedUser,
        selectedGroup,
        contacts,
        selectUser,
        selectGroup,
        updateContacts,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, useChatContext };
