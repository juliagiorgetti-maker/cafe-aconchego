CREATE DATABASE IF NOT EXISTS cafe_aconchego CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafe_aconchego;

DROP TABLE IF EXISTS itens_pedido;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS produtos;

CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255),
  preco DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(50) DEFAULT 'Bebida',
  imagem VARCHAR(150) DEFAULT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_cliente VARCHAR(100) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'Recebido',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itens_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NULL,
  produto_nome VARCHAR(100) NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  quantidade INT NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE SET NULL
);

INSERT INTO produtos (nome, descricao, preco, categoria, imagem) VALUES
('Espresso Tradicional', 'Café puro extraído na pressão certa', 6.00, 'Bebida', 'produto-espresso.svg'),
('Cappuccino Cremoso', 'Espresso, leite vaporizado e espuma', 10.00, 'Bebida', 'produto-cappuccino.svg'),
('Latte Macchiato', 'Leite vaporizado com um toque de café', 12.00, 'Bebida', 'produto-latte.svg'),
('Bolo do Dia (Fatia)', 'Receita caseira, sabor variado diariamente', 8.00, 'Doce', 'produto-bolo.svg'),
('Pão de Queijo Recheado', 'Recheio de catupiry, servido quente', 7.00, 'Salgado', 'produto-pao-queijo.svg');
