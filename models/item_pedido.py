class ItemPedido:
    """Um produto dentro de um pedido."""
    def __init__(self, produto_nome, preco_unitario, quantidade, produto_id=None, id=None):
        if int(quantidade) <= 0:
            raise ValueError("A quantidade deve ser maior que zero.")
        self.id = id
        self.produto_id = produto_id
        self.produto_nome = produto_nome
        self.preco_unitario = float(preco_unitario)
        self.quantidade = int(quantidade)

    @property
    def subtotal(self):
        return round(self.preco_unitario * self.quantidade, 2)

    def to_dict(self):
        return {"produto_id": self.produto_id, "produto_nome": self.produto_nome,
                "preco_unitario": self.preco_unitario, "quantidade": self.quantidade,
                "subtotal": self.subtotal}
