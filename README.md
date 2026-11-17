# Café & Aconchego

Projeto integrado de cafeteria desenvolvido com HTML, CSS, JavaScript, Python/Flask, POO e MySQL.

## 1. Executar o sistema completo

O sistema com cadastro de produtos, pedidos e área administrativa precisa do Flask e do MySQL.

1. Inicie o MySQL pelo XAMPP.
2. Abra o phpMyAdmin e importe o arquivo `database/banco.sql`.
3. Abra o terminal na pasta principal do projeto.
4. Instale as dependências: `pip install -r requirements.txt`.
5. Confira usuário, senha e nome do banco em `config.py`.
6. Inicie o servidor: `python app.py`.
7. Abra no navegador: `http://127.0.0.1:5000`.

Se o MySQL tiver senha, configure a variável `DB_PASSWORD` ou atualize a configuração local em `config.py`.

## 2. Site publicado no GitHub Pages

O GitHub Pages hospeda arquivos estáticos. Ele não executa Python/Flask e não conecta ao MySQL. No endereço publicado, o cardápio mostra produtos de demonstração e o carrinho funciona apenas para visualização. Não é possível gravar pedidos nem administrar produtos pelo Pages.

Para usar todas as funções, execute o projeto localmente conforme a seção 1 ou publique o backend Flask e o banco em um serviço próprio. O Pages, sozinho, não hospeda o backend.

## 3. Organização dos arquivos

- `app.py`: inicialização do Flask e páginas estáticas permitidas.
- `config.py`: configuração de conexão com o MySQL.
- `routes/`: rotas da API.
- `models/`: classes de Produto, Pedido e ItemPedido (POO).
- `dao/`: operações de acesso ao banco de dados.
- `database/banco.sql`: criação das tabelas e produtos iniciais.
- `pages/`: cardápio, sobre e área administrativa.
- `css/`, `js/`, `img/`: arquivos do site.
- `docs/`: diagramas conceitual e lógico.

## 4. Rotas da API

- `GET /api/produtos`: lista produtos.
- `GET /api/produtos?categoria=Doce`: filtra por categoria.
- `GET /api/produtos/<id>`: consulta um produto.
- `POST /api/produtos`: cadastra produto.
- `PUT /api/produtos/<id>`: edita produto.
- `DELETE /api/produtos/<id>`: exclui produto.
- `GET /api/pedidos`: lista pedidos.
- `GET /api/pedidos/<id>`: consulta um pedido.
- `POST /api/pedidos`: registra pedido.
- `PATCH /api/pedidos/<id>/status`: atualiza o status de um pedido.

## 5. Observação

O arquivo SQL usa `CREATE TABLE IF NOT EXISTS` e não apaga tabelas existentes. Faça backup do banco antes de alterações manuais.
