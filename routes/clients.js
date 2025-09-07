const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const Log = require("../models/Log");
const auth = require("../middleware/authMiddleware");

// Criar cliente
router.post("/", auth, async (req, res) => {
  try {
    const client = await Client.create({
      ...req.body,
      createdBy: req.user.id, // pega o usuário logado
    });

    await Log.create({
      userId: req.user.id,
      action: `Criou cliente: ${client.name}`,
    });

    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Excluir cliente usando query (?id=...)
router.delete("/", auth, async (req, res) => {
  try {
    const { id } = req.query; // pega o ?id=xxx
    if (!id) {
      return res.status(400).json({ error: "O parâmetro 'id' é obrigatório" });
    }

    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    await Log.create({
      userId: req.user.id,
      action: `Excluiu cliente: ${client.name}`,
    });

    res.json({ message: "Cliente removido" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar todos os clientes ou buscar por ID (usando ?id=...)
router.get("/", auth, async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      // Se tiver id, busca um único cliente
      const client = await Client.findById(id).populate(
        "createdBy",
        "name phone role"
      );
      if (!client) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      return res.json(client);
    }

    // Se não tiver id, lista todos
    const clients = await Client.find().populate(
      "createdBy",
      "name phone role"
    );
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar cliente usando query (?id=...)
router.put("/", auth, async (req, res) => {
  try {
    const { id } = req.query; // pega o ?id=xxx
    if (!id) {
      return res.status(400).json({ error: "O parâmetro 'id' é obrigatório" });
    }

    const client = await Client.findByIdAndUpdate(id, req.body, { new: true });

    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    await Log.create({
      userId: req.user.id,
      action: `Atualizou cliente: ${client.name}`,
    });

    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
