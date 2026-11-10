"""DAOs: único lugar onde existe SQL."""
import mysql.connector
from .conexao import conectar
from .modelos import Produto, Pedido, ItemPedido


class ProdutoDAO:
    SELECT = ("SELECT p.id_produto, p.nome, p.descricao, p.preco, p.imagem, c.nome "
              "FROM produto p JOIN categoria c ON c.id_categoria = p.id_categoria ")

    def listar(self):
        con = conectar()
        try:
            cur = con.cursor()
            cur.execute(self.SELECT + "WHERE p.ativo = TRUE ORDER BY p.id_produto")
            return [Produto(*linha) for linha in cur.fetchall()]
        finally:
            con.close()

    def buscar_por_id(self, id_produto):
        con = conectar()
        try:
            cur = con.cursor()
            cur.execute(self.SELECT + "WHERE p.id_produto = %s AND p.ativo = TRUE", (id_produto,))
            linha = cur.fetchone()
            return Produto(*linha) if linha else None
        finally:
            con.close()

    def _id_categoria(self, cur, nome):
        cur.execute("SELECT id_categoria FROM categoria WHERE nome = %s", (nome,))
        linha = cur.fetchone()
        if linha:
            return linha[0]
        cur.execute("INSERT INTO categoria (nome) VALUES (%s)", (nome,))
        return cur.lastrowid

    def inserir(self, p):
        con = conectar()
        try:
            cur = con.cursor()
            cat = self._id_categoria(cur, p.categoria)
            cur.execute("INSERT INTO produto (nome, descricao, preco, imagem, id_categoria) "
                        "VALUES (%s, %s, %s, %s, %s)", (p.nome, p.descricao, p.preco, p.imagem, cat))
            con.commit()
            return cur.lastrowid
        finally:
            con.close()

    def atualizar(self, p):
        con = conectar()
        try:
            cur = con.cursor()
            cat = self._id_categoria(cur, p.categoria)
            cur.execute("UPDATE produto SET nome=%s, descricao=%s, preco=%s, id_categoria=%s "
                        "WHERE id_produto=%s", (p.nome, p.descricao, p.preco, cat, p.id_produto))
            con.commit()
            return cur.rowcount > 0
        finally:
            con.close()

    def excluir(self, id_produto):
        """Apaga o produto; se já foi vendido, apenas o desativa (preserva o histórico)."""
        con = conectar()
        try:
            cur = con.cursor()
            try:
                cur.execute("DELETE FROM produto WHERE id_produto = %s", (id_produto,))
            except mysql.connector.IntegrityError:
                con.rollback()
                cur.execute("UPDATE produto SET ativo = FALSE WHERE id_produto = %s", (id_produto,))
            con.commit()
        finally:
            con.close()


class PedidoDAO:
    def salvar(self, pedido):
        """Grava pedido + itens numa transação. O total sai dos preços do banco."""
        con = conectar()
        try:
            cur = con.cursor()
            cur.execute("INSERT INTO pedido (nome_cliente, total) VALUES (%s, %s)",
                        (pedido.nome_cliente, round(pedido.total(), 2)))
            pedido.id_pedido = cur.lastrowid
            for i in pedido.itens:
                cur.execute("INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario) "
                            "VALUES (%s, %s, %s, %s)",
                            (pedido.id_pedido, i.id_produto, i.quantidade, i.preco_unitario))
            con.commit()
            return pedido
        except Exception:
            con.rollback()
            raise
        finally:
            con.close()

    def listar(self):
        con = conectar()
        try:
            cur = con.cursor()
            cur.execute("SELECT id_pedido, nome_cliente, status FROM pedido ORDER BY id_pedido DESC")
            pedidos = [Pedido(n, id_pedido=i, status=s) for i, n, s in cur.fetchall()]
            for ped in pedidos:
                cur.execute("SELECT ip.id_produto, ip.quantidade, ip.preco_unitario, pr.nome "
                            "FROM item_pedido ip JOIN produto pr ON pr.id_produto = ip.id_produto "
                            "WHERE ip.id_pedido = %s", (ped.id_pedido,))
                ped.itens = [ItemPedido(a, b, c, d) for a, b, c, d in cur.fetchall()]
            return pedidos
        finally:
            con.close()
