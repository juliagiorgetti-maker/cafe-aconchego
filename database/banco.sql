-- =========================================================
-- MODELO FÍSICO — Café & Aconchego
-- Projeto Integrado DWS + POO + BD — Etapa 1
-- SGBD: MySQL 8 / MariaDB 10.4+ (XAMPP)
-- =========================================================

DROP DATABASE IF EXISTS cafe_aconchego;

CREATE DATABASE cafe_aconchego
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cafe_aconchego;

-- ---------------------------------------------------------
-- CATEGORIA (1) ---- classifica ---- (N) PRODUTO
-- ---------------------------------------------------------
CREATE TABLE categoria (
  id_categoria INT          NOT NULL AUTO_INCREMENT,
  nome         VARCHAR(50)  NOT NULL,
  CONSTRAINT pk_categoria      PRIMARY KEY (id_categoria),
  CONSTRAINT uq_categoria_nome UNIQUE (nome)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- PRODUTO
-- "ativo" permite tirar um item do cardápio sem apagar o
-- histórico de pedidos que já o utilizaram.
-- ---------------------------------------------------------
CREATE TABLE produto (
  id_produto   INT           NOT NULL AUTO_INCREMENT,
  nome         VARCHAR(100)  NOT NULL,
  descricao    VARCHAR(255)  NULL,
  preco        DECIMAL(10,2) NOT NULL,
  imagem       VARCHAR(150)  NULL,
  ativo        BOOLEAN       NOT NULL DEFAULT TRUE,
  criado_em    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_categoria INT           NOT NULL,
  CONSTRAINT pk_produto           PRIMARY KEY (id_produto),
  CONSTRAINT ck_produto_preco     CHECK (preco > 0),
  CONSTRAINT fk_produto_categoria FOREIGN KEY (id_categoria)
    REFERENCES categoria (id_categoria)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_produto_categoria ON produto (id_categoria);

-- ---------------------------------------------------------
-- PEDIDO (cabeçalho)
-- ---------------------------------------------------------
CREATE TABLE pedido (
  id_pedido    INT           NOT NULL AUTO_INCREMENT,
  nome_cliente VARCHAR(100)  NOT NULL,
  total        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status       ENUM('Recebido','Em preparo','Pronto','Entregue','Cancelado')
                             NOT NULL DEFAULT 'Recebido',
  criado_em    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_pedido       PRIMARY KEY (id_pedido),
  CONSTRAINT ck_pedido_total CHECK (total >= 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- ITEM_PEDIDO  (tabela associativa PEDIDO N ---- N PRODUTO)
-- preco_unitario guarda o preço no momento da compra.
-- ---------------------------------------------------------
CREATE TABLE item_pedido (
  id_pedido      INT           NOT NULL,
  id_produto     INT           NOT NULL,
  quantidade     INT           NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  CONSTRAINT pk_item_pedido PRIMARY KEY (id_pedido, id_produto),
  CONSTRAINT ck_item_qtd    CHECK (quantidade > 0),
  CONSTRAINT ck_item_preco  CHECK (preco_unitario > 0),
  CONSTRAINT fk_item_pedido FOREIGN KEY (id_pedido)
    REFERENCES pedido (id_pedido)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_item_produto FOREIGN KEY (id_produto)
    REFERENCES produto (id_produto)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_item_produto ON item_pedido (id_produto);

-- ---------------------------------------------------------
-- DADOS INICIAIS (cardápio)
-- ---------------------------------------------------------
INSERT INTO categoria (nome) VALUES ('Bebida'), ('Doce'), ('Salgado');

INSERT INTO produto (nome, descricao, preco, imagem, id_categoria) VALUES
('Espresso Tradicional',   'Café puro extraído na pressão certa',        6.00,  'produto-espresso.svg',   1),
('Cappuccino Cremoso',     'Espresso, leite vaporizado e espuma',       10.00,  'produto-cappuccino.svg', 1),
('Latte Macchiato',        'Leite vaporizado com um toque de café',     12.00,  'produto-latte.svg',      1),
('Bolo do Dia (Fatia)',    'Receita caseira, sabor variado diariamente', 8.00,  'produto-bolo.svg',       2),
('Pão de Queijo Recheado', 'Recheio de catupiry, servido quente',        7.00,  'produto-pao-queijo.svg', 3);
