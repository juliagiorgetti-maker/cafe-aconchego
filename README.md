# Café & Aconchego — Projeto Integrado (DWS + POO + BD)

Sistema web de cardápio e pedidos de uma cafeteria.

- **Banco de dados:** MySQL (`database/banco.sql`)
- **Back-end:** Python + Flask, com classes (`backend/modelos.py`) e DAOs (`backend/dao.py`)
- **Front-end:** HTML/CSS/JS (`frontend/`) consumindo a API com `fetch`

## Modelagem (Etapa 1)
Modelos em `docs/` (conceitual e lógico) e físico em `database/banco.sql`.
Tabelas: `categoria`, `produto`, `pedido`, `item_pedido`.

## Como rodar
1. Inicie o MySQL (XAMPP) e importe `database/banco.sql` (phpMyAdmin → Importar).
2. Instale as dependências:
   ```
   python -m venv .venv
   .venv\Scripts\activate        # Windows  (Linux/Mac: source .venv/bin/activate)
   pip install -r requirements.txt
   ```
3. Teste a conexão: `python -m backend.conexao`
   (usuário/senha padrão: `root` sem senha; mude com as variáveis `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`).
4. Rode: `python app.py` e abra http://localhost:5000

## API
| Método | Rota | Função |
|---|---|---|
| GET | `/api/produtos` | lista produtos ativos |
| POST | `/api/produtos` | cadastra produto |
| PUT | `/api/produtos/<id>` | edita produto |
| DELETE | `/api/produtos/<id>` | exclui (ou desativa, se já vendido) |
| GET | `/api/pedidos` | lista pedidos com itens |
| POST | `/api/pedidos` | registra pedido (total calculado no servidor) |

## Integrantes
- (preencher)
