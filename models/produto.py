class Produto:
    """Item do cardápio."""
    CATEGORIAS = ("Bebida", "Doce", "Salgado")

    def __init__(self, nome, preco, descricao="", categoria="Bebida", imagem=None, id=None):
        self.id = id
        self.nome = nome
        self.descricao = descricao
        self.preco = preco
        self.categoria = categoria
        self.imagem = imagem

    @property
    def nome(self):
        return self._nome

    @nome.setter
    def nome(self, valor):
        valor = (valor or "").strip()
        if not valor:
            raise ValueError("Informe o nome do produto.")
        self._nome = valor

    @property
    def preco(self):
        return self._preco

    @preco.setter
    def preco(self, valor):
        try:
            valor = float(valor)
        except (TypeError, ValueError):
            raise ValueError("Informe um preço válido maior que zero.")
        if valor <= 0:
            raise ValueError("Informe um preço válido maior que zero.")
        self._preco = round(valor, 2)

    @property
    def categoria(self):
        return self._categoria

    @categoria.setter
    def categoria(self, valor):
        valor = (valor or "Bebida").strip()
        if valor not in self.CATEGORIAS:
            raise ValueError("Categoria inválida. Use: " + ", ".join(self.CATEGORIAS) + ".")
        self._categoria = valor

    @classmethod
    def de_dict(cls, dados, id=None):
        return cls(dados.get("nome"), dados.get("preco"),
                   (dados.get("descricao") or "").strip(),
                   dados.get("categoria") or "Bebida", dados.get("imagem"), id)

    def to_dict(self):
        return {"id": self.id, "nome": self.nome, "descricao": self.descricao,
                "preco": self.preco, "categoria": self.categoria, "imagem": self.imagem}
