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
  const { setCurrentMessages, updateGroups, selectGroup, selectContact } =
    useChatContext();

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
        setCurrentMessages((prevMessages) => {
          // Check if the message already exists in the current state
          const messageExists = prevMessages.some(
            (msg) => msg._id === message._id
          );

          // If the message doesn't exist, add it to the state
          if (!messageExists) {
            // Additional check: if the sender is the current user, ensure it's not a duplicate
            if (message.sender._id !== user.id) {
              return [...prevMessages, message];
            }
          }

          return prevMessages;
        });

        // console.log("Message received:", message);
      };


      // Handle receiving a new group
      const handleGroupCreated = (group) => {
        updateGroups((prevGroups) => [...prevGroups, group]);
        console.log("New group created:", group);
      };

      // Handle group updates
      const handleGroupUpdated = (group) => {
        updateGroups((prevGroups) =>
          prevGroups.map((g) => (g._id === group._id ? group : g))
        );
        console.log("Group updated:", group);
      };

      // Handle group deletion
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
      socket.current.on("groupCreated", handleGroupCreated);
      socket.current.on("groupUpdated", handleGroupUpdated);
      socket.current.on("groupDeleted", handleGroupDeleted);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [user, setCurrentMessages, updateGroups, selectGroup]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
