import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    admin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true } //creating and updating user is tracked
);

const User = mongoose.model("User", userSchema);

export default User;