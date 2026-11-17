import mysql.connector
from config import DB_CONFIG

class Conexao:
    """Abre conexões com o MySQL."""
    @staticmethod
    def obter():
        return mysql.connector.connect(**DB_CONFIG)
