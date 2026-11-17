document.addEventListener("DOMContentLoaded", function () {
    const listaProdutos = document.querySelector("#lista-produtos");
    const listaPedido = document.querySelector("#lista-pedido");
    const totalElemento = document.querySelector("#total");
    const formulario = document.querySelector("#form-pedido");
    const nomeCliente = document.querySelector("#nome-cliente");
    const mensagem = document.querySelector("#mensagem-pedido");
    if (!listaProdutos) return;

    // O GitHub Pages usa o caminho do repositório; o Flask local usa a raiz.
    const basePath = location.pathname.startsWith("/cafe-aconchego/") ? "/cafe-aconchego" : "";
    const api = function (caminho) { return basePath + caminho; };
    let apiDisponivel = true;
    const pedido = [];

    // Produtos de demonstração para o GitHub Pages, que não executa Flask/MySQL.
    const produtosDemo = [
        {id:1,nome:"Espresso Tradicional",descricao:"Café puro extraído na pressão certa",preco:6,categoria:"Bebida",imagem:"produto-espresso.svg"},
        {id:2,nome:"Cappuccino Cremoso",descricao:"Espresso, leite vaporizado e espuma",preco:10,categoria:"Bebida",imagem:"produto-cappuccino.svg"},
        {id:3,nome:"Latte Macchiato",descricao:"Leite vaporizado com um toque de café",preco:12,categoria:"Bebida",imagem:"produto-latte.svg"},
        {id:4,nome:"Bolo do Dia (Fatia)",descricao:"Receita caseira, sabor variado diariamente",preco:8,categoria:"Doce",imagem:"produto-bolo.svg"},
        {id:5,nome:"Pão de Queijo Recheado",descricao:"Recheio de catupiry, servido quente",preco:7,categoria:"Salgado",imagem:"produto-pao-queijo.svg"}
    ];

    function esc(texto) {
        const d = document.createElement("div");
        d.textContent = texto ?? "";
        return d.innerHTML;
    }

    function carregarProdutos(categoria) {
        fetch(api("/api/produtos" + (categoria ? "?categoria=" + encodeURIComponent(categoria) : "")))
            .then(function (r) {
                if (!r.ok) throw new Error("API indisponível");
                return r.json();
            })
            .then(function (produtos) {
                apiDisponivel = true;
                renderizarProdutos(produtos);
            })
            .catch(function (erro) {
                // No Pages, a API não existe: mostra o catálogo de exemplo sem quebrar a página.
                apiDisponivel = false;
                const produtos = categoria
                    ? produtosDemo.filter(function (p) { return p.categoria === categoria; })
                    : produtosDemo;
                renderizarProdutos(produtos);
                console.info("Mostrando cardápio demonstrativo. Para pedidos reais, execute o Flask com MySQL.", erro);
            });
    }

    function renderizarProdutos(produtos) {
        listaProdutos.innerHTML = "";
        if (!produtos.length) {
            listaProdutos.innerHTML = '<p class="carregando">Nenhum produto nesta categoria.</p>';
            return;
        }
        produtos.forEach(function (produto) {
            const artigo = document.createElement("article");
            artigo.classList.add("produto");
            artigo.dataset.id = produto.id;
            artigo.dataset.nome = produto.nome;
            artigo.dataset.preco = produto.preco;
            if (pedido.some(function (i) { return i.produtoId === produto.id; })) artigo.classList.add("selecionado");
            const imagem = produto.imagem
                ? '<img src="../img/' + encodeURIComponent(produto.imagem) + '" alt="Ilustração de ' + esc(produto.nome) + '" class="produto-imagem">'
                : "";
            artigo.innerHTML = imagem + '<div class="produto-info"><h3>' + esc(produto.nome) + '</h3><p class="produto-descricao">' + esc(produto.descricao) + '</p><p class="produto-preco">R$ ' + Number(produto.preco).toFixed(2).replace(".", ",") + '</p></div><button class="adicionar" type="button">Adicionar</button>';
            listaProdutos.appendChild(artigo);
        });
        listaProdutos.querySelectorAll(".adicionar").forEach(function (botao) {
            botao.addEventListener("click", function () { adicionarAoPedido(botao); });
        });
    }

    function adicionarAoPedido(botao) {
        const produto = botao.closest(".produto");
        const id = Number(produto.dataset.id);
        const item = pedido.find(function (i) { return i.produtoId === id; });
        if (item) item.quantidade++;
        else pedido.push({ produtoId: id, nome: produto.dataset.nome, preco: Number(produto.dataset.preco), quantidade: 1 });
        produto.classList.add("selecionado");
        botao.textContent = "Adicionado ✓";
        atualizarPedido();
    }

    function atualizarPedido() {
        listaPedido.innerHTML = "";
        if (pedido.length === 0) {
            listaPedido.innerHTML = '<p id="pedido-vazio">Seu pedido está vazio.</p>';
            totalElemento.textContent = "R$ 0,00";
            return;
        }
        let total = 0;
        pedido.forEach(function (item, indice) {
            const subtotal = item.preco * item.quantidade;
            total += subtotal;
            const div = document.createElement("div");
            div.classList.add("item-pedido");
            div.innerHTML = '<span>' + esc(item.nome) + '</span><span class="quantidade"><button type="button" class="qtd" data-indice="' + indice + '" data-delta="-1" aria-label="Diminuir">−</button><strong>' + item.quantidade + '</strong><button type="button" class="qtd" data-indice="' + indice + '" data-delta="1" aria-label="Aumentar">+</button></span><span>R$ ' + subtotal.toFixed(2).replace(".", ",") + '</span><button type="button" class="remover" data-indice="' + indice + '">Remover</button>';
            listaPedido.appendChild(div);
        });
        totalElemento.textContent = "R$ " + total.toFixed(2).replace(".", ",");
        listaPedido.querySelectorAll(".qtd").forEach(function (botao) {
            botao.addEventListener("click", function () {
                const indice = Number(botao.dataset.indice);
                pedido[indice].quantidade += Number(botao.dataset.delta);
                if (pedido[indice].quantidade <= 0) pedido.splice(indice, 1);
                atualizarPedido();
            });
        });
        listaPedido.querySelectorAll(".remover").forEach(function (botao) {
            botao.addEventListener("click", function () {
                pedido.splice(Number(botao.dataset.indice), 1);
                atualizarPedido();
                carregarProdutos(document.querySelector(".filtro.ativo")?.dataset.categoria || "");
            });
        });
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        if (!apiDisponivel) {
            mensagem.classList.add("erro");
            mensagem.textContent = "O cardápio está em modo de demonstração. Para salvar pedidos, abra o projeto pelo servidor Flask com o MySQL ligado.";
            return;
        }
        if (pedido.length === 0) {
            mensagem.classList.add("erro");
            mensagem.textContent = "Adicione pelo menos um produto ao pedido.";
            return;
        }
        const corpo = {
            nomeCliente: nomeCliente.value.trim(),
            itens: pedido.map(function (i) { return { produtoId: i.produtoId, quantidade: i.quantidade }; })
        };
        fetch(api("/api/pedidos"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        })
        .then(function (r) { return r.json(); })
        .then(function (dados) {
            if (dados.erro) throw new Error(dados.erro);
            mensagem.classList.remove("erro");
            mensagem.textContent = "Pedido #" + dados.pedidoId + " salvo! Total: R$ " + dados.total + ".";
            pedido.length = 0;
            atualizarPedido();
            formulario.reset();
            carregarProdutos(document.querySelector(".filtro.ativo")?.dataset.categoria || "");
        })
        .catch(function (erro) {
            mensagem.classList.add("erro");
            mensagem.textContent = erro.message || "Não foi possível salvar o pedido. Confira o Flask e o MySQL.";
        });
    });

    document.querySelectorAll(".filtro").forEach(function (botao) {
        botao.addEventListener("click", function () {
            document.querySelectorAll(".filtro").forEach(function (b) { b.classList.remove("ativo"); });
            botao.classList.add("ativo");
            carregarProdutos(botao.dataset.categoria);
        });
    });

    carregarProdutos();
    atualizarPedido();
});
