import os
from pathlib import Path

from flask import Flask, jsonify, send_from_directory
from werkzeug.exceptions import HTTPException

from routes import produtos_bp, pedidos_bp

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__, static_folder=None)
app.json.ensure_ascii = False

app.register_blueprint(produtos_bp)
app.register_blueprint(pedidos_bp)


@app.get("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


def servir_arquivo(pasta, arquivo):
    return send_from_directory(BASE_DIR / pasta, arquivo)


@app.get("/css/<path:arquivo>")
def css(arquivo):
    return servir_arquivo("css", arquivo)


@app.get("/js/<path:arquivo>")
def javascript(arquivo):
    return servir_arquivo("js", arquivo)


@app.get("/img/<path:arquivo>")
def imagens(arquivo):
    return servir_arquivo("img", arquivo)


@app.get("/pages/<path:arquivo>")
def paginas(arquivo):
    return servir_arquivo("pages", arquivo)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "aplicacao": "Cafe & Aconchego"})


@app.errorhandler(Exception)
def tratar_erro(erro):
    if isinstance(erro, HTTPException):
        return jsonify({"erro": erro.description}), erro.code
    app.logger.exception(erro)
    return jsonify({"erro": "Erro interno. Verifique as variaveis de conexao do MySQL."}), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5000")),
        debug=False
    )
