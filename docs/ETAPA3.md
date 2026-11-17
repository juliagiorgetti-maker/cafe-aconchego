# Entrega Final — Projeto completo (17/11/2026 às 18h)

## Integração
Sistema integrado: MySQL → DAOs (Python/POO) → rotas Flask → Fetch (JavaScript) → páginas HTML/CSS.

## Funcionalidades
- Cardápio carregado do banco de dados.
- Filtro por categoria.
- Carrinho com controle de quantidade e total atualizado.
- Finalização e gravação de pedidos.
- Área administrativa com cadastro, edição e exclusão de produtos.
- Lista de pedidos e atualização de status.

## Segurança e boas práticas
- Preço e total calculados no servidor.
- Consultas SQL parametrizadas nos DAOs.
- Pedido e itens gravados em transação.
- Histórico do pedido preservado quando um produto é excluído.

## Como executar
1. Instale as dependências com `pip install -r requirements.txt`.
2. Inicie o MySQL e importe `database/banco.sql`.
3. Confira as configurações em `config.py`.
4. Execute `python app.py`.
5. Abra `http://127.0.0.1:5000`.

## Conferências antes da apresentação
- Testar cardápio, filtros e carrinho.
- Finalizar um pedido.
- Cadastrar, editar e excluir produto na área administrativa.
- Alterar o status de um pedido.
