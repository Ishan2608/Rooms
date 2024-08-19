import React from "react";
import Message from "./Message"; // Ensure the path is correct
import NoMessagesContainer from "./NoMessagesContainer"; // Import the NoMessagesContainer component

const dummyMessages = [
  {
    type: "text",
    content: "Hey there! How are you doing? 😊",
    isSender: true,
  },
  {
    type: "image",
    content: "https://via.placeholder.com/200",
    isSender: false,
  },
  {
    type: "file",
    fileName: "example.pdf",
    content: "https://via.placeholder.com/150", // Just for example
    isSender: true,
  },
  {
    type: "text",
    content: "I’m good, thanks for asking! What about you?",
    isSender: false,
  },
  {
    type: "image",
    content: "https://via.placeholder.com/200",
    isSender: true,
  },
  {
    type: "file",
    fileName: "sample-video.mp4",
    content: "https://via.placeholder.com/150", // Just for example
    isSender: false,
  },
];

// Variable to simulate whether there are messages or not
const hasMessages = true;

const ChatMessages = () => {
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
        dummyMessages.map((message, index) => (
          <Message key={index} message={message} />
        ))
      ) : (
        <NoMessagesContainer />
      )}
    </div>
  );
};

export default ChatMessages;
