const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "operator", "client"],
      default: "operator",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
