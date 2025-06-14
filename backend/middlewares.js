const jwt = require("jsonwebtoken");

function authRestaurante(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded?.id) {
      return res.status(403).json({ erro: "Token inválido ou expirado" });
    }
    req.restaurante = decoded; // Pode conter { id, nome, etc... }
    next();
  });
}

function authAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded?.admin) {
      return res.status(403).json({ erro: "Token inválido ou sem permissão" });
    }
    req.admin = decoded;
    next();
  });
}

module.exports = { authRestaurante, authAdmin };
