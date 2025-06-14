require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();

// Garante que a pasta uploads existe
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const restauranteRoutes = require("./routes/restaurante");
const adminRoutes = require("./routes/admin");
const adminRestaurantesRoutes = require("./routes/admin_restaurantes");
const produtosRoutes = require("./routes/produtos");
const pixRoutes = require("./routes/pix");
const qrcodeRoutes = require("./routes/qrcode");
const pedidosRoutes = require("./routes/pedidos");
const comandasRoutes = require("./routes/comandas");

app.use("/restaurante", restauranteRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/restaurantes", adminRestaurantesRoutes);
app.use("/produtos", produtosRoutes);
app.use("/restaurante", pixRoutes);
app.use("/restaurante", qrcodeRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/comandas", comandasRoutes);

// Rotas serão importadas aqui
// Exemplo: app.use('/restaurante', require('./routes/restaurante'));

app.get("/", (req, res) => {
  res.send("Order Care backend rodando!");
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor acessível via IP na porta ${PORT}`);
});
}
