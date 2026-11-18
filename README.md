# ☕ Café & Aconchego — Projeto Integrado

Sistema web de cafeteria com cardápio, carrinho, registro de pedidos e painel administrativo.

**Tecnologias:** Python, Flask, POO, MySQL, HTML, CSS e JavaScript.

## Executar o projeto

1. Instale e inicie o MySQL pelo XAMPP.
2. Abra o phpMyAdmin e importe o arquivo `database/banco.sql`.
3. Na pasta principal do projeto, crie e ative um ambiente virtual:

   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

   No Linux/macOS, use `source venv/bin/activate`.

4. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

5. Confira as configurações do banco no arquivo `config.py`. Se necessário, configure as variáveis `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`.
6. Inicie o Flask localmente:

   ```bash
   python app.py
   ```

7. Acesse **http://127.0.0.1:5000**.

## Publicar o Flask

O arquivo `Procfile` inicia a aplicação com Gunicorn em serviços compatíveis. Para hospedar, configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME` nas variáveis privadas do serviço de hospedagem, usando os dados de um MySQL acessível pela internet. Não publique senhas no GitHub. O arquivo `render.yaml` prepara o serviço web no Render, mas não cria um servidor MySQL; o banco precisa ser contratado/configurado separadamente.

Depois da publicação, use a URL do serviço Flask para acessar o site. O endereço do GitHub Pages serve apenas arquivos estáticos e não executa a API.

> O sistema completo precisa do Flask e do MySQL ligados. O GitHub armazena o código-fonte, mas o GitHub Pages não executa Python/Flask nem conecta ao MySQL. Por isso, esta versão não usa GitHub Pages.

## Funcionalidades

- Cardápio carregado do banco de dados.
- Filtro por categoria.
- Carrinho com alteração de quantidade e remoção de itens.
- Registro de pedidos no MySQL.
- Cadastro, edição e exclusão de produtos.
- Consulta de pedidos e atualização de status.
- Resumo de pedidos, pedidos em aberto e faturamento.

## Estrutura

```
app.py              # inicialização do Flask
config.py           # configuração do MySQL
models/             # classes Produto, Pedido e ItemPedido
dao/                # conexão e acesso ao banco
routes/             # rotas da API Flask
database/           # script SQL do banco
index.html          # página inicial
pages/              # cardápio, sobre e painel administrativo
css/                # estilos
js/                 # scripts do navegador
img/                # imagens
docs/               # documentação e diagramas
```

## Rotas da API

| Método | Rota | Função |
|---|---|---|
| GET | `/api/produtos` | Lista os produtos |
| GET | `/api/produtos?categoria=Doce` | Filtra por categoria |
| GET | `/api/produtos/<id>` | Consulta um produto |
| POST | `/api/produtos` | Cadastra produto |
| PUT | `/api/produtos/<id>` | Edita produto |
| DELETE | `/api/produtos/<id>` | Exclui produto |
| GET | `/api/pedidos` | Lista pedidos |
| GET | `/api/pedidos/<id>` | Consulta um pedido |
| POST | `/api/pedidos` | Registra um pedido |
| PATCH | `/api/pedidos/<id>/status` | Atualiza o status |

## Testes

Com o MySQL ligado e o banco importado, execute:

```bash
python testar_conexao.py
python testar_etapa2.py
```

Os testes de integração criam e removem registros de teste. Use um banco de desenvolvimento.
