const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ["baixa", "media", "alta", "critica"],
      default: "baixa",
    },
    status: {
      type: String,
      enum: ["pendente", "em_andamento", "resolvido"],
      default: "pendente",
    },
    dateTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
