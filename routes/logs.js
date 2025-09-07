const express = require("express");
const router = express.Router();
const Log = require("../models/Log");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// 📌 Listar todos os logs (apenas admin pode acessar)
router.get("/", auth, async (req, res) => {
  try {
    // Verifica se o usuário logado é admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          error:
            "Acesso negado: apenas administradores podem visualizar os logs.",
        });
    }

    const logs = await Log.find().populate("userId", "name phone role");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Criar log manual (qualquer usuário logado pode registrar ação)
router.post("/", auth, async (req, res) => {
  try {
    const { action } = req.body;
    const log = await Log.create({
      userId: req.user.id, // pega do JWT
      action,
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
