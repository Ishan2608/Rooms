import React from "react";
import Message from "./Message"; // Ensure the path is correct
import NoMessagesContainer from "./NoMessagesContainer"; // Import the NoMessagesContainer component
import { useChatContext } from "../../context/ChatContext";

const ChatMessages = () => {

  const { currentMessages } = useChatContext();
  const hasMessages = currentMessages && currentMessages.length > 0;
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
        currentMessages.map((message, index) => (
          <Message index={index} message={message} />
        ))
      ) : (
        <NoMessagesContainer />
      )}
    </div>
  );
};

export default ChatMessages;
