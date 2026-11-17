# Café & Aconchego — Projeto Integrado (DWS + POO + BD)

Sistema web de cardápio e pedidos para uma cafeteria.

- **Front-end:** HTML, CSS e JavaScript.
- **Back-end:** Python + Flask, com models, DAOs e rotas.
- **Banco de dados:** MySQL.

## Como executar o sistema completo

1. Instale Python e MySQL (XAMPP também pode ser usado).
2. Instale as dependências: `pip install -r requirements.txt`.
3. Importe `database/banco.sql` no phpMyAdmin.
4. Confira as configurações de acesso ao banco em `config.py`.
5. Execute `python app.py`.
6. Abra `http://127.0.0.1:5000`.

## Funcionalidades da Etapa 3

- Cardápio carregado pela API e filtrado por categoria.
- Carrinho com aumento, diminuição e remoção de itens.
- Finalização de pedidos gravados no MySQL.
- Área administrativa com CRUD de produtos.
- Listagem de pedidos, resumo e alteração de status.

## Rotas principais

- `GET /api/produtos` e `GET /api/produtos?categoria=Doce`
- `POST /api/produtos`, `PUT /api/produtos/<id>`, `DELETE /api/produtos/<id>`
- `GET /api/pedidos`, `POST /api/pedidos`
- `PATCH /api/pedidos/<id>/status`

Consulte `docs/ETAPA3.md` para o roteiro da entrega final.

**Atenção:** o GitHub Pages hospeda somente páginas estáticas. Para usar os pedidos, o painel administrativo e o banco MySQL, execute o Flask com o MySQL ligado.
