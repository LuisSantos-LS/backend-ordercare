const express = require("express");
const pool = require("../db");
const { authRestaurante } = require("../middlewares");
const QRCode = require("qrcode");
const os = require("os");

const router = express.Router();

// Geração de QR Code por mesa
router.post("/qrcode", authRestaurante, async (req, res) => {
  const { url } = req.body;

  try {
    if (!url) {
      return res.status(400).json({ erro: "URL não informada" });
    }

    const qrCodeUrl = await QRCode.toDataURL(url);
    res.json({ qrCodeUrl });
  } catch (err) {
    console.error("Erro ao gerar QR Code:", err); // Mostra erro detalhado
    res
      .status(500)
      .json({
        erro: "Erro ao gerar QR Code",
        detalhe: err.message,
        stack: err.stack,
      });
  }
});

// Rota para obter o IP local do servidor
router.get("/server-ip", (req, res) => {
  const interfaces = os.networkInterfaces();
  let ip = "localhost";
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        ip = iface.address;
        break;
      }
    }
    if (ip !== "localhost") break;
  }
  res.json({ ip });
});

module.exports = router;
