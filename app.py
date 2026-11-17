from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException
from routes import produtos_bp, pedidos_bp

app = Flask(__name__, static_folder=".", static_url_path="")
app.json.ensure_ascii = False
app.register_blueprint(produtos_bp)
app.register_blueprint(pedidos_bp)

@app.get("/")
def home():
    return app.send_static_file("index.html")

@app.errorhandler(Exception)
def tratar_erro(e):
    if isinstance(e, HTTPException):
        return jsonify({"erro": e.description}), e.code
    app.logger.exception(e)
    return jsonify({"erro": "Erro interno. Verifique se o MySQL está rodando."}), 500

if __name__ == "__main__":
    app.run(debug=True)
