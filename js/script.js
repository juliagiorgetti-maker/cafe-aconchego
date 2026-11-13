document.addEventListener("DOMContentLoaded", function () {
    const listaProdutos = document.querySelector("#lista-produtos");
    const listaPedido = document.querySelector("#lista-pedido");
    const totalElemento = document.querySelector("#total");
    const formulario = document.querySelector("#form-pedido");
    const nomeCliente = document.querySelector("#nome-cliente");
    const mensagem = document.querySelector("#mensagem-pedido");

    // Se não estamos na página do cardápio, não faz nada.
    if (!listaProdutos) return;

    const pedido = [];
    const modoGitHubPages = window.location.hostname.endsWith("github.io");

    // Produtos iniciais iguais aos cadastrados em database/banco.sql.
    // No GitHub Pages, eles aparecem mesmo sem o servidor Flask.
    const produtosDemonstracao = [
        { id: 1, nome: "Espresso Tradicional", descricao: "Café puro extraído na pressão certa", preco: 6.00, imagem: "produto-espresso.svg" },
        { id: 2, nome: "Cappuccino Cremoso", descricao: "Espresso, leite vaporizado e espuma", preco: 10.00, imagem: "produto-cappuccino.svg" },
        { id: 3, nome: "Latte Macchiato", descricao: "Leite vaporizado com um toque de café", preco: 12.00, imagem: "produto-latte.svg" },
        { id: 4, nome: "Bolo do Dia (Fatia)", descricao: "Receita caseira, sabor variado diariamente", preco: 8.00, imagem: "produto-bolo.svg" },
        { id: 5, nome: "Pão de Queijo Recheado", descricao: "Recheio de catupiry, servido quente", preco: 7.00, imagem: "produto-pao-queijo.svg" }
    ];

    function carregarProdutos() {
        fetch("/api/produtos")
            .then(function (resposta) {
                if (!resposta.ok) throw new Error("Erro ao buscar produtos");
                return resposta.json();
            })
            .then(function (produtos) {
                renderizarProdutos(produtos);
            })
            .catch(function (erro) {
                if (modoGitHubPages) {
                    renderizarProdutos(produtosDemonstracao);
                    mensagem.textContent = "Visualização pelo GitHub: os produtos são demonstrativos. Para registrar pedidos, abra o projeto com Flask e MySQL.";
                    return;
                }

                listaProdutos.innerHTML =
                    '<p class="mensagem erro">Não foi possível carregar o cardápio. Verifique se o servidor Flask e o MySQL estão rodando.</p>';
                console.error(erro);
            });
    }

    function renderizarProdutos(produtos) {
        listaProdutos.innerHTML = "";

        produtos.forEach(function (produto) {
            const artigo = document.createElement("article");
            artigo.classList.add("produto");
            artigo.dataset.id = produto.id ?? produto.id_produto;
            artigo.dataset.nome = produto.nome;
            artigo.dataset.preco = produto.preco;

            const imagem = produto.imagem
                ? `<img src="../img/${produto.imagem}" alt="Ilustração de ${produto.nome}" class="produto-imagem">`
                : "";

            artigo.innerHTML = `
                ${imagem}
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p class="produto-descricao">${produto.descricao ?? ""}</p>
                    <p class="produto-preco">R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}</p>
                </div>
                <button class="adicionar" type="button">Adicionar</button>
            `;

            listaProdutos.appendChild(artigo);
        });

        document.querySelectorAll(".adicionar").forEach(function (botao) {
            botao.addEventListener("click", function () {
                adicionarAoPedido(botao);
            });
        });
    }

    function adicionarAoPedido(botao) {
        const produto = botao.closest(".produto");
        const id = Number(produto.dataset.id);
        const nome = produto.dataset.nome;
        const preco = Number(produto.dataset.preco);
        const itemExistente = pedido.find(function (item) {
            return item.id === id;
        });

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            pedido.push({ id: id, nome: nome, preco: preco, quantidade: 1 });
        }

        produto.classList.add("selecionado");
        botao.textContent = "Adicionado ✓";
        setTimeout(function () {
            botao.textContent = "Adicionar";
        }, 1000);

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
            div.innerHTML = `
                <span>${item.nome} — ${item.quantidade}x</span>
                <span>R$ ${subtotal.toFixed(2).replace(".", ",")}</span>
                <button type="button" class="remover" data-indice="${indice}">Remover</button>
            `;
            listaPedido.appendChild(div);
        });

        totalElemento.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;

        document.querySelectorAll(".remover").forEach(function (botao) {
            botao.addEventListener("click", function () {
                const indice = Number(botao.dataset.indice);
                pedido.splice(indice, 1);
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

        if (modoGitHubPages) {
            mensagem.classList.add("erro");
            mensagem.textContent = "O carrinho funciona para demonstração, mas o GitHub Pages não executa Flask/MySQL. Para salvar pedidos, execute o projeto pelo VS Code com python app.py.";
            return;
        }

        const corpo = {
            nomeCliente: nomeCliente.value.trim(),
            itens: pedido
        };

        fetch("/api/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        })
            .then(function (resposta) { return resposta.json(); })
            .then(function (dados) {
                if (dados.erro) {
                    mensagem.classList.add("erro");
                    mensagem.textContent = dados.erro;
                    return;
                }

                mensagem.classList.remove("erro");
                mensagem.textContent = `Pedido #${dados.pedidoId} de ${nomeCliente.value.trim()} salvo com sucesso! Total: R$ ${dados.total}.`;

                pedido.length = 0;
                atualizarPedido();
                formulario.reset();
                document.querySelectorAll(".produto.selecionado").forEach(function (el) {
                    el.classList.remove("selecionado");
                });
            })
            .catch(function (erro) {
                mensagem.classList.add("erro");
                mensagem.textContent = "Erro de conexão ao salvar o pedido. Tente novamente.";
                console.error(erro);
            });
    });

    carregarProdutos();
    atualizarPedido();
});
