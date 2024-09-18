import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  image: {
    type: String,
    required: false,
    default: "",
  },
});

const Group = mongoose.model("Groups", groupSchema);
export default Group;
