const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

// Login do admin
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);
    if (!rows.length)
      return res.status(401).json({ erro: "Admin não encontrado" });
    const admin = rows[0];
    const senhaOk = await bcrypt.compare(senha, admin.senha);
    if (!senhaOk) return res.status(401).json({ erro: "Senha inválida" });
    const token = jwt.sign(
      { id: admin.id, email: admin.email, admin: true },
      process.env.JWT_SECRET
    );
    delete admin.senha;
    res.json({ admin, token });
  } catch (err) {
    res.status(500).json({ erro: "Erro no login do admin" });
  }
});

// Cadastro de admin (opcional, para uso inicial)
router.post("/", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const hash = await bcrypt.hash(senha, 10);
    await pool.query("INSERT INTO admin (email, senha) VALUES (?, ?)", [
      email,
      hash,
    ]);
    res.status(201).json({ msg: "Admin cadastrado" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao cadastrar admin" });
  }
});

module.exports = router;
