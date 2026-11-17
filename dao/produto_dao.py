from dao.conexao import Conexao
from models import Produto

class ProdutoDAO:
    """Acesso à tabela produtos (CRUD)."""
    @staticmethod
    def _linha_para_produto(l):
        return Produto(id=l["id"], nome=l["nome"], descricao=l["descricao"] or "",
                       preco=l["preco"], categoria=l["categoria"], imagem=l["imagem"])

    def listar(self):
        con = Conexao.obter()
        try:
            cur = con.cursor(dictionary=True)
            cur.execute("SELECT id, nome, descricao, preco, categoria, imagem FROM produtos ORDER BY id")
            return [self._linha_para_produto(l) for l in cur.fetchall()]
        finally:
            con.close()

    def listar_por_categoria(self, categoria):
        con = Conexao.obter()
        try:
            cur = con.cursor(dictionary=True)
            cur.execute("SELECT id, nome, descricao, preco, categoria, imagem FROM produtos WHERE categoria = %s ORDER BY id", (categoria,))
            return [self._linha_para_produto(l) for l in cur.fetchall()]
        finally:
            con.close()

    def buscar_por_id(self, id):
        con = Conexao.obter()
        try:
            cur = con.cursor(dictionary=True)
            cur.execute("SELECT id, nome, descricao, preco, categoria, imagem FROM produtos WHERE id = %s", (id,))
            linha = cur.fetchone()
            return self._linha_para_produto(linha) if linha else None
        finally:
            con.close()

    def inserir(self, produto):
        con = Conexao.obter()
        try:
            cur = con.cursor()
            cur.execute("INSERT INTO produtos (nome, descricao, preco, categoria, imagem) VALUES (%s, %s, %s, %s, %s)",
                        (produto.nome, produto.descricao, produto.preco, produto.categoria, produto.imagem))
            con.commit()
            produto.id = cur.lastrowid
            return produto
        finally:
            con.close()

    def atualizar(self, produto):
        if self.buscar_por_id(produto.id) is None:
            return False
        con = Conexao.obter()
        try:
            cur = con.cursor()
            cur.execute("UPDATE produtos SET nome=%s, descricao=%s, preco=%s, categoria=%s, imagem=COALESCE(%s, imagem) WHERE id=%s",
                        (produto.nome, produto.descricao, produto.preco, produto.categoria, produto.imagem, produto.id))
            con.commit()
            return True
        finally:
            con.close()

    def excluir(self, id):
        con = Conexao.obter()
        try:
            cur = con.cursor()
            cur.execute("DELETE FROM produtos WHERE id = %s", (id,))
            con.commit()
            return cur.rowcount > 0
        finally:
            con.close()
