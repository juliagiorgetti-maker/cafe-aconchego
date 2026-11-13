# Café & Aconchego — Projeto Integrado (DWS + POO + BD)

Sistema web de cardápio e pedidos de uma cafeteria.

- **Banco de dados:** MySQL (`database/banco.sql`)
- **Back-end:** Python + Flask, com classes (`backend/modelos.py`) e DAOs (`backend/dao.py`)
- **Front-end:** HTML/CSS/JavaScript (`index.html`, `css/`, `js/`, `pages/`)

## Visualizar pelo GitHub Pages

O GitHub Pages publica a parte visual do projeto. O cardápio mostra os cinco produtos de demonstração cadastrados no SQL e permite montar o carrinho. **O envio de pedidos e a área administrativa precisam do Flask e do MySQL**, que não são executados pelo GitHub Pages.

Depois que o workflow terminar, acesse:
`https://juliagiorgetti-maker.github.io/cafe-aconchego/`

## Rodar o sistema completo no computador

1. Inicie o MySQL (XAMPP) e importe `database/banco.sql` (phpMyAdmin → Importar).
2. Instale as dependências:
   ```
   python -m venv .venv
   .venv\\Scripts\\activate
   pip install -r requirements.txt
   ```
3. Teste a conexão: `python -m backend.conexao`.
4. Rode `python app.py` e abra http://localhost:5000.

## API

| Método | Rota | Função |
|---|---|---|
| GET | `/api/produtos` | lista produtos ativos |
| POST | `/api/produtos` | cadastra produto |
| PUT | `/api/produtos/<id>` | edita produto |
| DELETE | `/api/produtos/<id>` | exclui produto |
| GET | `/api/pedidos` | lista pedidos com itens |
| POST | `/api/pedidos` | registra pedido |

## Integrantes

- (preencher)
