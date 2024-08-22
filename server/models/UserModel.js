import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
    default: ""
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  }],
});

const User = mongoose.model("Users", userSchema);

export default User;
