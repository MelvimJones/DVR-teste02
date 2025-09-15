const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

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
app.use("/api/reports", require("./routes/reports"));
app.use("/api/logs", require("./routes/logs"));

// Conexão ao MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

// Criar servidor HTTP e integrar com Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // libera para testes, em produção restringe
  },
});

// Escutar conexões
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Tornar o io acessível nas rotas
app.set("io", io);

// Iniciar servidor
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

// Para Vercel (não suporta socket.io direto, só rotas HTTP)
module.exports = app;