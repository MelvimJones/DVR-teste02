const express = require("express");
const router = express.Router();
const Shift = require("../models/Shift");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Criar turno
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { operator, startTime, endTime, notes } = req.body;

    const shift = await Shift.create({
      operator,
      startTime,
      endTime,
      notes,
    });

    res.status(201).json({ message: "Turno criado com sucesso", shift });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Listar todos os turnos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const shifts = await Shift.find().populate("operator", "name phone role");
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Buscar turno por ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id).populate(
      "operator",
      "name phone role"
    );
    if (!shift) return res.status(404).json({ error: "Turno não encontrado" });
    res.json(shift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Atualizar turno
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { operator, startTime, endTime, notes } = req.body;
    const shift = await Shift.findByIdAndUpdate(
      req.params.id,
      { operator, startTime, endTime, notes },
      { new: true }
    );

    if (!shift) return res.status(404).json({ error: "Turno não encontrado" });
    res.json({ message: "Turno atualizado com sucesso", shift });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Deletar turno
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);
    if (!shift) return res.status(404).json({ error: "Turno não encontrado" });
    res.json({ message: "Turno deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
