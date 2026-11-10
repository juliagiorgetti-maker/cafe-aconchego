"""Servidor Flask: serve o front-end e expõe a API JSON em /api."""
from flask import Flask, jsonify, request
from backend.dao import ProdutoDAO, PedidoDAO
from backend.modelos import Produto, Pedido, ItemPedido

app = Flask(__name__, static_folder="frontend", static_url_path="")
produtos_dao = ProdutoDAO()
pedidos_dao = PedidoDAO()


@app.route("/")
def inicio():
    return app.send_static_file("index.html")


def _produto_do_json(dados, id_produto=None):
    try:
        preco = float(dados.get("preco"))
    except (TypeError, ValueError):
        preco = 0
    return Produto(id_produto, (dados.get("nome") or "").strip(), (dados.get("descricao") or "").strip(),
                   preco, None, (dados.get("categoria") or "Bebida").strip())


@app.get("/api/produtos")
def listar_produtos():
    return jsonify([p.para_dict() for p in produtos_dao.listar()])


@app.post("/api/produtos")
def cadastrar_produto():
    produto = _produto_do_json(request.get_json(silent=True) or {})
    erro = produto.validar()
    if erro:
        return jsonify({"erro": erro}), 400
    novo_id = produtos_dao.inserir(produto)
    return jsonify({"sucesso": True, "id": novo_id, "mensagem": "Produto cadastrado com sucesso."}), 201


@app.put("/api/produtos/<int:id_produto>")
def editar_produto(id_produto):
    produto = _produto_do_json(request.get_json(silent=True) or {}, id_produto)
    erro = produto.validar()
    if erro:
        return jsonify({"erro": erro}), 400
    if not produtos_dao.atualizar(produto):
        return jsonify({"erro": "Produto não encontrado."}), 404
    return jsonify({"sucesso": True, "mensagem": "Produto atualizado com sucesso."})


@app.delete("/api/produtos/<int:id_produto>")
def excluir_produto(id_produto):
    produtos_dao.excluir(id_produto)
    return jsonify({"sucesso": True, "mensagem": "Produto removido com sucesso."})


@app.get("/api/pedidos")
def listar_pedidos():
    return jsonify([p.para_dict() for p in pedidos_dao.listar()])


@app.post("/api/pedidos")
def salvar_pedido():
    dados = request.get_json(silent=True) or {}
    nome = (dados.get("nomeCliente") or "").strip()
    itens = []
    for item in dados.get("itens") or []:
        produto = produtos_dao.buscar_por_id(item.get("id"))
        try:
            qtd = int(item.get("quantidade"))
        except (TypeError, ValueError):
            qtd = 0
        if produto and qtd > 0:  # preço vem do banco, não do navegador
            itens.append(ItemPedido(produto.id_produto, qtd, produto.preco, produto.nome))
    if not nome or not itens:
        return jsonify({"erro": "Informe seu nome e adicione ao menos um item ao pedido."}), 400
    pedido = pedidos_dao.salvar(Pedido(nome, itens))
    return jsonify({"sucesso": True, "pedidoId": pedido.id_pedido,
                    "total": f"{pedido.total():.2f}".replace(".", ",")}), 201


if __name__ == "__main__":
    app.run(debug=True, port=5000)
