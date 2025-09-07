const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Evitar 404 do favicon
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Rota de teste / boas-vindas
app.get("/", (req, res) => {
  res.send("🎉 API DVR Monitoring funcionando! 🚀");
});

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

// Se estiver rodando localmente, usa porta do .env ou 5000
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

// Para deploy Vercel
module.exports = app;
