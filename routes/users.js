const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

// 📌 Criar usuário (qualquer usuário pode criar, mas sempre como operador)
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role: "operator", // 🚨 força sempre operador
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Criar usuário com qualquer role (apenas admin)
router.post("/create", auth, isAdmin, async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role, // admin pode definir
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Atualizar usuário (admin pode atualizar tudo, operador apenas seus dados)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // operador só pode editar o próprio usuário
    if (req.user.role !== "admin" && req.user.id !== id) {
      return res
        .status(403)
        .json({ error: "Você só pode editar sua própria conta" });
    }

    const updateData = { ...req.body };

    // operador nunca pode mudar role
    if (req.user.role !== "admin") {
      delete updateData.role;
    }

    // admin pode atualizar qualquer campo
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Listar todos os usuários (apenas admin)
router.get(
  "/",
  /* auth, isAdmin, */ async (req, res) => {
    try {
      const users = await User.find().select("-password"); // oculta senha
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
