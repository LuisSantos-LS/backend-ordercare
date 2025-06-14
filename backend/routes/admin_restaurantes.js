const express = require("express");
const pool = require("../db");
const { authAdmin } = require("../middlewares");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Listar restaurantes
router.get("/", authAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nome, email, chave_pix FROM restaurantes"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar restaurantes" });
  }
});

// Remover restaurante
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM restaurantes WHERE id = ?", [req.params.id]);
    res.json({ msg: "Restaurante removido" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover restaurante" });
  }
});

// Cadastro de restaurante pelo admin
router.post("/", authAdmin, async (req, res) => {
  const { nome, email, senha, chave_pix } = req.body;
  try {
    console.log({ nome, email, senha, chave_pix }); // Log dos dados recebidos
    const hash = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "INSERT INTO restaurantes (nome, email, senha, chave_pix) VALUES (?, ?, ?, ?)",
      [nome, email, hash, chave_pix]
    );
    console.log("Restaurante cadastrado com sucesso!", result);
    res.status(201).json({ msg: "Restaurante cadastrado" });
  } catch (err) {
    console.error("Erro ao cadastrar restaurante:", err);
    res
      .status(500)
      .json({
        erro: "Erro ao cadastrar restaurante",
        detalhe: err && (err.message || JSON.stringify(err)),
      });
  }
});

module.exports = router;
