const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dvrIp: { type: String },
    dvrPort: { type: Number, default: 8245 }, // ✅ valor automático
    address: { type: String },
    dvrUser: { type: String, default: "admin" }, // ✅ valor automático
    dvrPassword: { type: String, default: "Mssec1001" }, // ✅ valor automático
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
