"""Conexão com o MySQL. Ajuste pelas variáveis de ambiente, se precisar."""
import os
import mysql.connector

CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "cafe_aconchego"),
}


def conectar():
    return mysql.connector.connect(**CONFIG)


if __name__ == "__main__":  # teste rápido: python -m backend.conexao
    con = conectar()
    cur = con.cursor()
    cur.execute("SELECT COUNT(*) FROM produto")
    print("Conexão OK. Produtos cadastrados:", cur.fetchone()[0])
    con.close()
