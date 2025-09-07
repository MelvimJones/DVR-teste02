const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/clients", require("./routes/clients"));
app.use("/api/shifts", require("./routes/shifts"));
// app.use("/api/reports", require("./routes/reports"));
app.use("/api/logs", require("./routes/logs"));

// Conexão ao MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

module.exports = app;
