const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

// Login do restaurante
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM restaurantes WHERE email = ?",
      [email]
    );
    if (!rows.length)
      return res.status(401).json({ erro: "Restaurante não encontrado" });
    const restaurante = rows[0];
    const senhaOk = await bcrypt.compare(senha, restaurante.senha);
    if (!senhaOk) return res.status(401).json({ erro: "Senha inválida" });
    const token = jwt.sign(
      { id: restaurante.id, email: restaurante.email, tipo: "restaurante" },
      process.env.JWT_SECRET
    );
    delete restaurante.senha;
    res.json({ restaurante, token });
  } catch (err) {
    res.status(500).json({ erro: "Erro no login do restaurante" });
  }
});

// Cadastro de restaurante (usado pelo admin)
router.post("/", async (req, res) => {
  const { nome, email, senha, chave_pix } = req.body;
  try {
    const hash = await bcrypt.hash(senha, 10);
    await pool.query(
      "INSERT INTO restaurantes (nome, email, senha, chave_pix) VALUES (?, ?, ?, ?)",
      [nome, email, hash, chave_pix]
    );
    res.status(201).json({ msg: "Restaurante cadastrado" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao cadastrar restaurante" });
  }
});

module.exports = router;
