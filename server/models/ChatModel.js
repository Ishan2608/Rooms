import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  file: {
    url: { type: String },
    name: { type: String },
    type: { type: String },
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Groups",
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});


const Chat = mongoose.model("Chats", chatSchema);
export default Chat;
