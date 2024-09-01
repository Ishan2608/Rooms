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
    selectedGroup,
    setCurrentMessages,
    updateGroups,
    selectGroup,
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
        updateGroups((prevGroups) => [...prevGroups, group]);
        console.log("New group created:", group);
      };

      const handleGroupUpdated = (group) => {
        updateGroups((prevGroups) =>
          prevGroups.map((g) => (g._id === group._id ? group : g))
        );
        console.log("Group updated:", group);
      };

      const handleGroupDeleted = (groupId) => {
        updateGroups((prevGroups) =>
          prevGroups.filter((g) => g._id !== groupId)
        );
        if (selectGroup && selectGroup._id === groupId) {
          selectGroup(null); // Clear the selected group if it was deleted
        }
        console.log("Group deleted:", groupId);
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receiveGroupMessage", handleReceiveGroupMessage);
      socket.current.on("groupCreated", handleGroupCreated);
      socket.current.on("groupUpdated", handleGroupUpdated);
      socket.current.on("groupDeleted", handleGroupDeleted);

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
