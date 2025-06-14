-- Admin
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL
);

-- Restaurantes
CREATE TABLE IF NOT EXISTS restaurantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  chave_pix VARCHAR(255)
);

-- Produtos
CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  imagem_url VARCHAR(255),
  categoria ENUM('entradas', 'pratos', 'bebidas', 'sobremesas'),
  restaurante_id INT,
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

-- Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurante_id INT,
  status VARCHAR(50) DEFAULT 'Recebido',
  forma_pagamento VARCHAR(50),
  data DATETIME DEFAULT CURRENT_TIMESTAMP,
  mesa VARCHAR(20),
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

-- Itens do Pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT,
  produto_id INT,
  observacao VARCHAR(255),
  quantidade INT DEFAULT 1,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- Comandas
CREATE TABLE IF NOT EXISTS comandas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mesa VARCHAR(20),
  pedido_id INT,
  status VARCHAR(50) DEFAULT 'Aberta',
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);
