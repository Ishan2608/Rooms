import React, {useEffect} from "react";
import Message from "./Message"; // Ensure the path is correct
import NoMessagesContainer from "./NoMessagesContainer"; // Import the NoMessagesContainer component
import { useChatContext } from "../../context/ChatContext";

const ChatMessages = () => {
  const { selectedContact, selectedGroup, currentMessages, fetchChatMessages, } = useChatContext();
  const hasMessages = currentMessages && currentMessages.length > 0;

  useEffect(() => {
    if (selectedContact) {
      fetchChatMessages(selectedContact);
    } else if (selectedGroup) {
      fetchChatMessages(selectedGroup);
    }
  }, [selectedContact, selectedGroup, fetchChatMessages]);

  return (
    <div
      style={{
        padding: "10px",
        height: "calc(100vh - 100px)",
        overflowY: "auto",
        backgroundColor: "#333",
      }}
    >
      {hasMessages ? (
        currentMessages.map((message) => (
          <Message index={message._id} message={message} />
        ))
      ) : (
        <NoMessagesContainer />
      )}
    </div>
  );
};

export default ChatMessages;
