from dao.conexao import Conexao
from models import Pedido, ItemPedido

class PedidoDAO:
    """Acesso às tabelas pedidos e itens_pedido."""
    def salvar(self, pedido):
        con = Conexao.obter()
        try:
            cur = con.cursor()
            cur.execute("INSERT INTO pedidos (nome_cliente, total, status) VALUES (%s, %s, %s)",
                        (pedido.nome_cliente, pedido.total, pedido.status))
            pedido.id = cur.lastrowid
            for i in pedido.itens:
                cur.execute("INSERT INTO itens_pedido (pedido_id, produto_id, produto_nome, preco_unitario, quantidade) VALUES (%s, %s, %s, %s, %s)",
                            (pedido.id, i.produto_id, i.produto_nome, i.preco_unitario, i.quantidade))
            con.commit()
            return pedido
        except Exception:
            con.rollback()
            raise
        finally:
            con.close()

    @staticmethod
    def _carregar_itens(cur, pedido):
        cur.execute("SELECT produto_id, produto_nome, preco_unitario, quantidade FROM itens_pedido WHERE pedido_id = %s ORDER BY id", (pedido.id,))
        for l in cur.fetchall():
            pedido.adicionar_item(ItemPedido(l["produto_nome"], l["preco_unitario"], l["quantidade"], l["produto_id"]))

    def listar(self):
        con = Conexao.obter()
        try:
            cur = con.cursor(dictionary=True)
            cur.execute("SELECT id, nome_cliente, status, criado_em FROM pedidos ORDER BY id DESC")
            pedidos = [Pedido(l["nome_cliente"], l["status"], l["id"], l["criado_em"]) for l in cur.fetchall()]
            for p in pedidos:
                self._carregar_itens(cur, p)
            return pedidos
        finally:
            con.close()

    def buscar_por_id(self, id):
        con = Conexao.obter()
        try:
            cur = con.cursor(dictionary=True)
            cur.execute("SELECT id, nome_cliente, status, criado_em FROM pedidos WHERE id = %s", (id,))
            l = cur.fetchone()
            if l is None:
                return None
            pedido = Pedido(l["nome_cliente"], l["status"], l["id"], l["criado_em"])
            self._carregar_itens(cur, pedido)
            return pedido
        finally:
            con.close()

    def atualizar_status(self, id, novo_status):
        if self.buscar_por_id(id) is None:
            return False
        con = Conexao.obter()
        try:
            cur = con.cursor()
            cur.execute("UPDATE pedidos SET status = %s WHERE id = %s", (novo_status, id))
            con.commit()
            return True
        finally:
            con.close()
