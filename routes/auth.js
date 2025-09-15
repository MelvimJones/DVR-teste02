const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Log = require("../models/Log");

// Teste simples
router.get("/", (req, res) => {
  res.send("Auth route funcionando 🚀");
});

// Registrar usuário
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role,
    });

    // Log do registro
    const ip =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
    await Log.create({
      userId: user._id,
      action: `Usuário registrado. IP: ${ip}`,
    });

    res.status(201).json({ message: "Usuário registrado com sucesso", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login usuário
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    const ip =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;

    if (!user) {
      // Log de tentativa falha
      await Log.create({
        userId: null,
        action: `Tentativa de login falha: usuário não encontrado (Phone: ${phone}). IP: ${ip}`,
      });
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log de tentativa falha
      await Log.create({
        userId: user._id,
        action: `Tentativa de login falha: senha inválida. IP: ${ip}`,
      });
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Log de login bem-sucedido
    await Log.create({
      userId: user._id,
      action: `Login realizado com sucesso. IP: ${ip}`,
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
