"""Classes de domínio (POO) do sistema Café & Aconchego."""


class Categoria:
    def __init__(self, id_categoria, nome):
        self.id_categoria = id_categoria
        self.nome = nome


class Produto:
    def __init__(self, id_produto, nome, descricao, preco, imagem, categoria):
        self.id_produto = id_produto
        self.nome = nome
        self.descricao = descricao
        self.preco = float(preco)
        self.imagem = imagem
        self.categoria = categoria  # nome da categoria (str)

    def validar(self):
        """Regras de negócio básicas. Retorna mensagem de erro ou None."""
        if not self.nome or not self.nome.strip():
            return "Informe o nome do produto."
        if self.preco <= 0:
            return "O preço deve ser maior que zero."
        return None

    def para_dict(self):
        return {"id": self.id_produto, "nome": self.nome, "descricao": self.descricao,
                "preco": self.preco, "categoria": self.categoria, "imagem": self.imagem}


class ItemPedido:
    def __init__(self, id_produto, quantidade, preco_unitario, produto_nome=None):
        self.id_produto = id_produto
        self.quantidade = quantidade
        self.preco_unitario = float(preco_unitario)
        self.produto_nome = produto_nome

    def subtotal(self):
        return self.preco_unitario * self.quantidade


class Pedido:
    def __init__(self, nome_cliente, itens=None, id_pedido=None, status="Recebido"):
        self.id_pedido = id_pedido
        self.nome_cliente = nome_cliente
        self.status = status
        self.itens = itens or []

    def total(self):
        return sum(i.subtotal() for i in self.itens)

    def para_dict(self):
        return {"id": self.id_pedido, "nome_cliente": self.nome_cliente,
                "total": round(self.total(), 2), "status": self.status,
                "itens": [{"produto_nome": i.produto_nome, "quantidade": i.quantidade,
                           "preco_unitario": i.preco_unitario} for i in self.itens]}
