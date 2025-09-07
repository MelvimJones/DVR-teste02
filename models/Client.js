const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dvrIp: { type: String, required: true },
    dvrPort: { type: Number, required: true },
    address: { type: String, required: true },
    dvrUser: { type: String, required: true },
    dvrPassword: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
