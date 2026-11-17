# Café & Aconchego

Projeto integrado de cafeteria desenvolvido com HTML, CSS, JavaScript, Python/Flask, POO e MySQL.

## Executar o sistema completo (Flask + MySQL)

1. Inicie o MySQL pelo XAMPP ou serviço instalado.
2. Abra o phpMyAdmin e importe `database/banco.sql`.
3. No terminal, dentro da pasta do projeto, instale as dependências:
   `pip install -r requirements.txt`
4. Confira usuário e senha do banco em `config.py`.
5. Inicie o sistema:
   `python app.py`
6. Acesse `http://127.0.0.1:5000`.

Nesse modo, o cardápio consulta o MySQL e os pedidos são gravados no banco. A área administrativa permite cadastrar, editar e excluir produtos e atualizar o status dos pedidos.

## Site publicado no GitHub Pages

O GitHub Pages hospeda apenas arquivos estáticos e não executa Python, Flask ou MySQL. Por isso, o cardápio publicado mostra produtos de demonstração para a página não ficar vazia. O carrinho permite visualizar quantidades e valores, mas não grava pedidos. Para salvar pedidos e administrar produtos, use o sistema local com Flask e MySQL.

## Estrutura principal

- `app.py`: inicialização do Flask.
- `routes/`: rotas da API.
- `models/`: classes do projeto (POO).
- `dao/`: operações com o banco de dados.
- `database/banco.sql`: criação das tabelas e produtos iniciais.
- `pages/`: cardápio, sobre e administração.
- `css/`, `js/`, `img/`: arquivos do site.
- `docs/`: documentação e diagramas do projeto.

## API

- `GET /api/produtos` — lista produtos.
- `GET /api/produtos?categoria=Doce` — filtra por categoria.
- `POST /api/produtos` — cadastra produto.
- `PUT /api/produtos/<id>` — edita produto.
- `DELETE /api/produtos/<id>` — exclui produto.
- `GET /api/pedidos` — lista pedidos.
- `POST /api/pedidos` — registra pedido.
- `PATCH /api/pedidos/<id>/status` — atualiza status.
