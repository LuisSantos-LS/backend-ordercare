const express = require("express");
const pool = require("../db");
const { authRestaurante } = require("../middlewares");

const router = express.Router();

// Buscar e atualizar chave PIX do restaurante logado
router.get("/pix", authRestaurante, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT chave_pix FROM restaurantes WHERE id = ?",
      [req.restaurante.id]
    );
    res.json({ chave_pix: rows[0]?.chave_pix || "" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar chave PIX" });
  }
});

router.put("/pix", authRestaurante, async (req, res) => {
  const { chave_pix } = req.body;
  try {
    await pool.query("UPDATE restaurantes SET chave_pix = ? WHERE id = ?", [
      chave_pix,
      req.restaurante.id,
    ]);
    res.json({ msg: "Chave PIX atualizada" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar chave PIX" });
  }
});

module.exports = router;
