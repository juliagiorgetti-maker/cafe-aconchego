from flask import Blueprint, jsonify, request
from dao import ProdutoDAO
from models import Produto

produtos_bp = Blueprint("produtos", __name__, url_prefix="/api/produtos")
dao = ProdutoDAO()

@produtos_bp.get("")
def listar():
    categoria = request.args.get("categoria")
    produtos = dao.listar_por_categoria(categoria) if categoria else dao.listar()
    return jsonify([p.to_dict() for p in produtos])

@produtos_bp.get("/<int:id>")
def buscar(id):
    produto = dao.buscar_por_id(id)
    if produto is None:
        return jsonify({"erro": "Produto não encontrado."}), 404
    return jsonify(produto.to_dict())

@produtos_bp.post("")
def cadastrar():
    try:
        produto = Produto.de_dict(request.get_json(silent=True) or {})
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    dao.inserir(produto)
    return jsonify({"sucesso": True, "id": produto.id,
                    "mensagem": "Produto cadastrado com sucesso."}), 201

@produtos_bp.put("/<int:id>")
def editar(id):
    try:
        produto = Produto.de_dict(request.get_json(silent=True) or {}, id=id)
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    if not dao.atualizar(produto):
        return jsonify({"erro": "Produto não encontrado."}), 404
    return jsonify({"sucesso": True, "mensagem": "Produto atualizado com sucesso."})

@produtos_bp.delete("/<int:id>")
def excluir(id):
    if not dao.excluir(id):
        return jsonify({"erro": "Produto não encontrado."}), 404
    return jsonify({"sucesso": True, "mensagem": "Produto removido com sucesso."})
