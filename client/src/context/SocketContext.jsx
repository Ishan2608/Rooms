import { createContext, useContext, useEffect, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import { useChatContext } from "./ChatContext";
import { io } from "socket.io-client";
import { HOST } from "../api/constants";

const SocketContext = createContext(null);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { user } = useAuthContext();
  const {
    selectedContact,
    groups,
    setGroups,
    selectedGroup,
    selectGroup,
    updateGroups,
    setCurrentMessages,
    setUnknownContacts,
  } = useChatContext();

  useEffect(() => {
    if (user) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: user.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to Socket Server");
      });

      const handleReceiveMessage = (message) => {
        // Update messages only if the message is from the currently selected contact
        if (selectedContact && message.sender._id === selectedContact._id) {
          setCurrentMessages((prevMessages) => {
            const messageExists = prevMessages.some(
              (msg) => msg._id === message._id
            );

            if (!messageExists && message.sender._id !== user.id) {
              return [...prevMessages, message];
            }
            return prevMessages;
          });
        }
      };

      const handleReceiveUnknownMessage = (message) => {
        // 1. Add the sender to the list of unknownContacts if not already present
        setUnknownContacts((prevContacts) => {
          const contactExists = prevContacts.some(
            (contact) => contact._id === message.sender._id
          );
          if (!contactExists) {
            return [...prevContacts, message.sender];
          }
          return prevContacts;
        });

        // 2. If the sender is the selected contact, update the currentMessages
        setCurrentMessages((prevMessages) => {
          // Check if the message already exists in the currentMessages
          const messageExists = prevMessages.some(
            (msg) => msg._id === message._id
          );
          if (!messageExists) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      };


      const handleReceiveGroupMessage = (message) => {
        // Ensure that the message is only handled if it comes from the selected group
        if (selectedGroup && message.group._id === selectedGroup._id) {
          setCurrentMessages((prevMessages) => {
            // Check if the message already exists in the state
            const messageExists = prevMessages.some(
              (msg) => msg._id === message._id
            );

            // If the message does not exist, add it to the state
            if (!messageExists) {
              // Ensure the message is not from the current user if it's a group message
              if (message.sender._id !== user.id) {
                return [...prevMessages, message];
              }
            }

            // Return the previous state if the message already exists or is from the current user
            return prevMessages;
          });
        }
      };

      const handleGroupCreated = (group) => {
        const newGroups = [...groups, group];
        // updateGroups(newGroups);
        setGroups(newGroups);
        selectGroup(group);
      };

      const handleGroupUpdated = (group) => {
        updateGroups((prevGroups) =>
          prevGroups.map((g) => (g._id === group._id ? group : g))
        );
        selectGroup(group);
        console.log("Group updated:", group);
      };

      const handleGroupDeleted = (groupId) => {
        updateGroups((prevGroups) =>
          prevGroups.filter((g) => g._id !== groupId)
        );
        if (selectGroup && selectGroup._id === groupId) {
          selectGroup(null); // Clear selected group
          setCurrentMessages([]); // Clear messages for the left group
        }
        console.log("Group deleted:", groupId);
      };

      const handleGroupMemberLeave = (groupId) => {

        updateGroups((prevGroups) => {
          // Filter out the group that the user left
          return prevGroups.filter((group) => group._id !== groupId);
        });

        // If the user had the group selected, clear the selection
        if (selectedGroup && selectedGroup._id === groupId) {
          selectGroup(null); // Clear selected group
          setCurrentMessages([]); // Clear messages for the left group
        }

        console.log("Left group");
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receiveGroupMessage", handleReceiveGroupMessage);
      socket.current.on("receiveUnknownMessage", handleReceiveUnknownMessage);
      socket.current.on("groupCreated", handleGroupCreated);
      socket.current.on("groupUpdated", handleGroupUpdated);
      socket.current.on("groupDeleted", handleGroupDeleted);
      socket.current.on("groupMemberLeft", handleGroupMemberLeave);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [
    user,
    selectedContact,
    selectedGroup,
    setCurrentMessages,
    updateGroups,
    selectGroup,
  ]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
