const express = require("express");
const pool = require("../db");

const router = express.Router();

// Criar comanda
router.post("/", async (req, res) => {
  const { mesa, pedido_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO comandas (mesa, pedido_id, status) VALUES (?, ?, ?)",
      [mesa, pedido_id, "Aberta"]
    );
    res.status(201).json({ msg: "Comanda criada" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar comanda" });
  }
});

// Encerrar comanda
router.put("/:id/encerrar", async (req, res) => {
  try {
    await pool.query("UPDATE comandas SET status = ? WHERE id = ?", [
      "Encerrada",
      req.params.id,
    ]);
    res.json({ msg: "Comanda encerrada" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao encerrar comanda" });
  }
});

// Encerrar comanda por mesa e restaurante
router.put("/encerrar", async (req, res) => {
  const { restaurante_id, mesa } = req.body;
  if (!restaurante_id || !mesa) {
    return res.status(400).json({ erro: "restaurante_id e mesa obrigatórios" });
  }
  try {
    // Busca a comanda aberta mais recente para a mesa/restaurante
    const [rows] = await pool.query(
      "SELECT id FROM comandas WHERE status = 'Aberta' AND mesa = ? ORDER BY id DESC LIMIT 1",
      [mesa]
    );
    if (!rows.length)
      return res.status(404).json({ erro: "Comanda não encontrada" });
    await pool.query("UPDATE comandas SET status = 'Encerrada' WHERE id = ?", [
      rows[0].id,
    ]);
    res.json({ msg: "Comanda encerrada" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao encerrar comanda" });
  }
});

// Listar comandas abertas
router.get("/abertas", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM comandas WHERE status = ?", [
      "Aberta",
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar comandas" });
  }
});

module.exports = router;
