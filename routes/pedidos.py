from flask import Blueprint, jsonify, request
from dao import PedidoDAO, ProdutoDAO
from models import Pedido, ItemPedido

pedidos_bp = Blueprint("pedidos", __name__, url_prefix="/api/pedidos")
pedido_dao = PedidoDAO()
produto_dao = ProdutoDAO()

@pedidos_bp.get("")
def listar():
    return jsonify([p.to_dict() for p in pedido_dao.listar()])

@pedidos_bp.get("/<int:id>")
def buscar(id):
    pedido = pedido_dao.buscar_por_id(id)
    if pedido is None:
        return jsonify({"erro": "Pedido não encontrado."}), 404
    return jsonify(pedido.to_dict())

@pedidos_bp.patch("/<int:id>/status")
def atualizar_status(id):
    dados = request.get_json(silent=True) or {}
    novo = dados.get("status")
    if novo not in Pedido.STATUS_VALIDOS:
        return jsonify({"erro": "Status inválido. Use: " + ", ".join(Pedido.STATUS_VALIDOS) + "."}), 400
    if not pedido_dao.atualizar_status(id, novo):
        return jsonify({"erro": "Pedido não encontrado."}), 404
    return jsonify({"sucesso": True, "mensagem": "Status atualizado para " + novo + "."})

@pedidos_bp.post("")
def criar():
    dados = request.get_json(silent=True) or {}
    itens = dados.get("itens")
    if not isinstance(itens, list) or not itens:
        return jsonify({"erro": "Informe seu nome e adicione ao menos um item ao pedido."}), 400
    try:
        pedido = Pedido(dados.get("nomeCliente"))
        for item in itens:
            if not isinstance(item, dict):
                return jsonify({"erro": "Formato de item inválido."}), 400
            produto = produto_dao.buscar_por_id(item.get("produtoId"))
            if produto is None:
                return jsonify({"erro": "Um dos produtos do pedido não existe mais."}), 400
            pedido.adicionar_item(ItemPedido(produto.nome, produto.preco,
                                             item.get("quantidade"), produto.id))
    except (ValueError, TypeError):
        return jsonify({"erro": "Informe seu nome e itens com quantidade válida."}), 400
    pedido_dao.salvar(pedido)
    return jsonify({"sucesso": True, "pedidoId": pedido.id,
                    "total": f"{pedido.total:.2f}".replace(".", ",")}), 201
