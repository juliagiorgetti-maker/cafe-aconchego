class Pedido:
    """Pedido de um cliente, composto por vários ItemPedido."""
    STATUS_VALIDOS = ("Recebido", "Em preparo", "Pronto", "Entregue", "Cancelado")

    def __init__(self, nome_cliente, status="Recebido", id=None, criado_em=None):
        nome_cliente = (nome_cliente or "").strip()
        if not nome_cliente:
            raise ValueError("Informe seu nome.")
        self.id = id
        self.nome_cliente = nome_cliente
        self.status = status
        self.criado_em = criado_em
        self.itens = []

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, valor):
        if valor not in self.STATUS_VALIDOS:
            raise ValueError("Status inválido. Use: " + ", ".join(self.STATUS_VALIDOS) + ".")
        self._status = valor

    def adicionar_item(self, item):
        self.itens.append(item)

    @property
    def total(self):
        return round(sum(i.subtotal for i in self.itens), 2)

    def to_dict(self):
        return {"id": self.id, "nome_cliente": self.nome_cliente, "total": self.total,
                "status": self.status, "criado_em": str(self.criado_em) if self.criado_em else None,
                "itens": [i.to_dict() for i in self.itens]}
