const express = require("express");
const pool = require("../db");

const router = express.Router();

// Criar novo pedido
router.post("/", async (req, res) => {
  const { itens, mesa, restaurante_id, forma_pagamento } = req.body;
  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: "Itens do pedido obrigatórios" });
  }
  try {
    // Cria o pedido
    const [pedidoResult] = await pool.query(
      "INSERT INTO pedidos (restaurante_id, status, forma_pagamento, mesa) VALUES (?, ?, ?, ?)",
      [restaurante_id, "Recebido", forma_pagamento || null, mesa || null]
    );
    const pedidoId = pedidoResult.insertId;
    // Cria os itens do pedido
    for (const item of itens) {
      await pool.query(
        "INSERT INTO itens_pedido (pedido_id, produto_id, observacao, quantidade) VALUES (?, ?, ?, ?)",
        [pedidoId, item.id, item.observacao || "", item.quantidade || 1]
      );
    }
    res.status(201).json({ msg: "Pedido criado", pedido_id: pedidoId });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar pedido" });
  }
});

// Listar pedidos do restaurante logado
router.get("/", async (req, res) => {
  const restaurante_id = req.query.restaurante_id;
  if (!restaurante_id)
    return res.status(400).json({ erro: "restaurante_id obrigatório" });
  try {
    const [pedidos] = await pool.query(
      "SELECT * FROM pedidos WHERE restaurante_id = ? ORDER BY data DESC",
      [restaurante_id]
    );
    for (const pedido of pedidos) {
      const [itens] = await pool.query(
        "SELECT ip.*, p.nome FROM itens_pedido ip JOIN produtos p ON ip.produto_id = p.id WHERE ip.pedido_id = ?",
        [pedido.id]
      );
      pedido.itens = itens;
    }
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar pedidos" });
  }
});

// Atualizar status do pedido
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query("UPDATE pedidos SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);
    res.json({ msg: "Status atualizado" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar status" });
  }
});

// Buscar status do último pedido da mesa/restaurante
router.get("/status", async (req, res) => {
  const { restaurante_id, mesa } = req.query;
  if (!restaurante_id || !mesa) {
    return res.status(400).json({ erro: "restaurante_id e mesa obrigatórios" });
  }
  try {
    const [rows] = await pool.query(
      "SELECT status FROM pedidos WHERE restaurante_id = ? AND mesa = ? ORDER BY data DESC LIMIT 1",
      [restaurante_id, mesa]
    );
    if (rows.length === 0)
      return res.json({ status: "Nenhum pedido encontrado" });
    res.json({ status: rows[0].status });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar status" });
  }
});

module.exports = router;
