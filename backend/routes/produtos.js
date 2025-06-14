const express = require("express");
const pool = require("../db");
const { authRestaurante } = require("../middlewares");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s/g, ""));
  },
});
const upload = multer({ storage });

// Padronização das respostas e comentários

// Listar produtos do restaurante logado
router.get("/", authRestaurante, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM produtos WHERE restaurante_id = ?",
      [req.restaurante.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao listar produtos" });
  }
});

// Listar todos os produtos de um restaurante (público, para cardápio do cliente)
router.get("/public/:restauranteId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM produtos WHERE restaurante_id = ?",
      [req.params.restauranteId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao listar produtos" });
  }
});

// Cadastrar produto
router.post("/", authRestaurante, async (req, res) => {
  const { nome, descricao, preco, imagem_url, categoria } = req.body;
  try {
    await pool.query(
      "INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria, restaurante_id) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, descricao, preco, imagem_url, categoria, req.restaurante.id]
    );
    res.status(201).json({ mensagem: "Produto cadastrado com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao cadastrar produto" });
  }
});

// Editar produto
router.put("/:id", authRestaurante, async (req, res) => {
  const { nome, descricao, preco, imagem_url } = req.body;
  try {
    await pool.query(
      "UPDATE produtos SET nome=?, descricao=?, preco=?, imagem_url=? WHERE id=? AND restaurante_id=?",
      [nome, descricao, preco, imagem_url, req.params.id, req.restaurante.id]
    );
    res.json({ mensagem: "Produto atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao atualizar produto" });
  }
});

// Excluir produto
router.delete("/:id", authRestaurante, async (req, res) => {
  try {
    await pool.query("DELETE FROM produtos WHERE id=? AND restaurante_id=?", [
      req.params.id,
      req.restaurante.id,
    ]);
    res.json({ mensagem: "Produto excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao excluir produto" });
  }
});

// Rota para upload de imagem
router.post("/upload", authRestaurante, upload.single("imagem"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensagem: "Nenhuma imagem enviada" });
  }
  // URL relativa para facilitar uso no frontend
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
