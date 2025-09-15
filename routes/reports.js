const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const Log = require("../models/Log");
const auth = require("../middleware/authMiddleware");

// ✅ Criar relatório
router.post("/", auth, async (req, res) => {
  try {
    const { shiftId, description, priority } = req.body;

    const report = await Report.create({
      shiftId,
      userId: req.user.id,
      description,
      priority,
    });

    // Criar log
    await Log.create({
      userId: req.user.id,
      action: `Criou relatório: ${report._id}`,
    });

    // 🔥 Notificar em tempo real
    const io = req.app.get("io");
    io.emit("report_created", report);

    res.status(201).json({ message: "Relatório criado com sucesso", report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ✅ Listar todos os relatórios ou buscar por ID via query
router.get("/", auth, async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      const report = await Report.findById(id)
        .populate("userId", "name phone role")
        .populate("shiftId", "startTime endTime");

      if (!report)
        return res.status(404).json({ error: "Relatório não encontrado" });

      return res.json(report);
    }

    const reports = await Report.find()
      .populate("userId", "name phone role")
      .populate("shiftId", "startTime endTime");

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Atualizar relatório usando query
router.put("/", auth, async (req, res) => {
  try {
    const { id } = req.query;
    const { description, priority, status } = req.body;

    if (!id)
      return res.status(400).json({ error: "O parâmetro 'id' é obrigatório" });

    const report = await Report.findByIdAndUpdate(
      id,
      { description, priority, status },
      { new: true }
    );

    if (!report)
      return res.status(404).json({ error: "Relatório não encontrado" });

    // Criar log
    await Log.create({
      userId: req.user.id,
      action: `Atualizou relatório: ${report._id}`,
    });

    res.json({ message: "Relatório atualizado com sucesso", report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Deletar relatório usando query
router.delete("/", auth, async (req, res) => {
  try {
    const { id } = req.query;

    if (!id)
      return res.status(400).json({ error: "O parâmetro 'id' é obrigatório" });

    const report = await Report.findByIdAndDelete(id);

    if (!report)
      return res.status(404).json({ error: "Relatório não encontrado" });

    // Criar log
    await Log.create({
      userId: req.user.id,
      action: `Deletou relatório: ${report._id}`,
    });

    res.json({ message: "Relatório deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
