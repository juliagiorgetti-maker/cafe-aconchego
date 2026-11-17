document.addEventListener("DOMContentLoaded", function () {
    const listaProdutos = document.querySelector("#lista-produtos");
    const listaPedido = document.querySelector("#lista-pedido");
    const totalElemento = document.querySelector("#total");
    const formulario = document.querySelector("#form-pedido");
    const nomeCliente = document.querySelector("#nome-cliente");
    const mensagem = document.querySelector("#mensagem-pedido");
    if (!listaProdutos) return;
    const pedido = [];

    function esc(texto) {
        const d = document.createElement("div");
        d.textContent = texto ?? "";
        return d.innerHTML;
    }

    function carregarProdutos(categoria) {
        const url = categoria ? "/api/produtos?categoria=" + encodeURIComponent(categoria) : "/api/produtos";
        fetch(url).then(function (r) {
            if (!r.ok) throw new Error("Erro ao buscar produtos");
            return r.json();
        }).then(renderizarProdutos).catch(function (erro) {
            listaProdutos.innerHTML = '<p class="mensagem erro">Não foi possível carregar o cardápio. Verifique se o servidor Flask e o MySQL estão rodando.</p>';
            console.error(erro);
        });
    }

    function renderizarProdutos(produtos) {
        listaProdutos.innerHTML = "";
        if (produtos.length === 0) {
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
            const imagem = produto.imagem ? '<img src="../img/' + encodeURIComponent(produto.imagem) + '" alt="Ilustração de ' + esc(produto.nome) + '" class="produto-imagem">' : "";
            artigo.innerHTML = imagem + '<div class="produto-info"><h3>' + esc(produto.nome) + '</h3><p class="produto-descricao">' + esc(produto.descricao) + '</p><p class="produto-preco">R$ ' + Number(produto.preco).toFixed(2).replace(".", ",") + '</p></div><button class="adicionar" type="button">Adicionar</button>';
            listaProdutos.appendChild(artigo);
        });
        document.querySelectorAll(".adicionar").forEach(function (botao) {
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
        setTimeout(function () { botao.textContent = "Adicionar"; }, 1000);
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
        document.querySelectorAll(".qtd").forEach(function (botao) {
            botao.addEventListener("click", function () {
                const indice = Number(botao.dataset.indice);
                pedido[indice].quantidade += Number(botao.dataset.delta);
                if (pedido[indice].quantidade <= 0) pedido.splice(indice, 1);
                atualizarPedido();
            });
        });
        document.querySelectorAll(".remover").forEach(function (botao) {
            botao.addEventListener("click", function () {
                const removido = pedido.splice(Number(botao.dataset.indice), 1)[0];
                const card = document.querySelector('.produto[data-id="' + removido.produtoId + '"]');
                if (card) card.classList.remove("selecionado");
                atualizarPedido();
            });
        });
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        if (pedido.length === 0) {
            mensagem.textContent = "Adicione pelo menos um produto ao pedido.";
            mensagem.classList.add("erro");
            return;
        }
        const corpo = { nomeCliente: nomeCliente.value.trim(), itens: pedido.map(function (i) {
            return { produtoId: i.produtoId, quantidade: i.quantidade };
        }) };
        fetch("/api/pedidos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) })
            .then(function (r) { return r.json(); })
            .then(function (dados) {
                if (dados.erro) {
                    mensagem.classList.add("erro");
                    mensagem.textContent = dados.erro;
                    return;
                }
                mensagem.classList.remove("erro");
                mensagem.textContent = 'Pedido #' + dados.pedidoId + ' de ' + nomeCliente.value.trim() + ' salvo com sucesso! Total: R$ ' + dados.total + '.';
                pedido.length = 0;
                atualizarPedido();
                formulario.reset();
                document.querySelectorAll(".produto.selecionado").forEach(function (el) { el.classList.remove("selecionado"); });
            })
            .catch(function (erro) {
                mensagem.classList.add("erro");
                mensagem.textContent = "Erro de conexão ao salvar o pedido. Tente novamente.";
                console.error(erro);
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
