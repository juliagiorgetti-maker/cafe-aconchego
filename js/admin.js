document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector("#form-produto");
    const campoId = document.querySelector("#produto-id");
    const campoNome = document.querySelector("#produto-nome");
    const campoDescricao = document.querySelector("#produto-descricao");
    const campoPreco = document.querySelector("#produto-preco");
    const campoCategoria = document.querySelector("#produto-categoria");
    const botaoSalvar = document.querySelector("#btn-salvar-produto");
    const botaoCancelar = document.querySelector("#btn-cancelar-edicao");
    const mensagem = document.querySelector("#mensagem-admin");
    const corpoTabela = document.querySelector("#tabela-produtos tbody");
    const listaPedidosAdmin = document.querySelector("#lista-pedidos-admin");

    // ---------- LISTAR (produtos) ----------
    function carregarProdutos() {
        fetch("/api/produtos")
            .then(function (r) { return r.json(); })
            .then(renderizarTabela)
            .catch(function () {
                corpoTabela.innerHTML = '<tr><td colspan="5">Erro ao carregar produtos.</td></tr>';
            });
    }

    function renderizarTabela(produtos) {
        corpoTabela.innerHTML = "";

        if (produtos.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="5">Nenhum produto cadastrado.</td></tr>';
            return;
        }

        produtos.forEach(function (produto) {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}</td>
                <td>
                    <button type="button" class="btn-editar" data-id="${produto.id}">Editar</button>
                    <button type="button" class="btn-excluir remover" data-id="${produto.id}">Excluir</button>
                </td>
            `;
            corpoTabela.appendChild(linha);
        });

        // Ações de editar
        document.querySelectorAll(".btn-editar").forEach(function (botao) {
            botao.addEventListener("click", function () {
                const produto = produtos.find(function (p) { return p.id == botao.dataset.id; });
                preencherFormularioParaEdicao(produto);
            });
        });

        // Ações de excluir
        document.querySelectorAll(".btn-excluir").forEach(function (botao) {
            botao.addEventListener("click", function () {
                excluirProduto(botao.dataset.id);
            });
        });
    }

    // ---------- CADASTRAR / EDITAR (mesmo formulário) ----------
    function preencherFormularioParaEdicao(produto) {
        campoId.value = produto.id;
        campoNome.value = produto.nome;
        campoDescricao.value = produto.descricao || "";
        campoPreco.value = produto.preco;
        campoCategoria.value = produto.categoria;

        botaoSalvar.textContent = "Salvar alterações";
        botaoCancelar.hidden = false;
        campoNome.focus();
    }

    function limparFormulario() {
        formulario.reset();
        campoId.value = "";
        botaoSalvar.textContent = "Cadastrar produto";
        botaoCancelar.hidden = true;
    }

    botaoCancelar.addEventListener("click", limparFormulario);

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const dados = {
            id: campoId.value || null,
            nome: campoNome.value.trim(),
            descricao: campoDescricao.value.trim(),
            preco: parseFloat(campoPreco.value),
            categoria: campoCategoria.value
        };

        const editando = Boolean(dados.id);
        const url = editando ? "/api/produtos/" + dados.id : "/api/produtos";
        const metodo = editando ? "PUT" : "POST";

        fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })
            .then(function (r) { return r.json(); })
            .then(function (resultado) {
                if (resultado.erro) {
                    mensagem.classList.add("erro");
                    mensagem.textContent = resultado.erro;
                    return;
                }
                mensagem.classList.remove("erro");
                mensagem.textContent = resultado.mensagem;
                limparFormulario();
                carregarProdutos();
            })
            .catch(function () {
                mensagem.classList.add("erro");
                mensagem.textContent = "Erro de conexão com o servidor.";
            });
    });

    // ---------- EXCLUIR ----------
    function excluirProduto(id) {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return;

        fetch("/api/produtos/" + id, { method: "DELETE" })
            .then(function (r) { return r.json(); })
            .then(function () {
                carregarProdutos();
            })
            .catch(function () {
                mensagem.classList.add("erro");
                mensagem.textContent = "Erro ao excluir produto.";
            });
    }

    // ---------- LISTAR PEDIDOS ----------
    function carregarPedidos() {
        fetch("/api/pedidos")
            .then(function (r) { return r.json(); })
            .then(renderizarPedidos)
            .catch(function () {
                listaPedidosAdmin.innerHTML = "<p>Erro ao carregar pedidos.</p>";
            });
    }

    function renderizarPedidos(pedidos) {
        if (pedidos.length === 0) {
            listaPedidosAdmin.innerHTML = "<p>Nenhum pedido registrado ainda.</p>";
            return;
        }

        listaPedidosAdmin.innerHTML = pedidos.map(function (pedido) {
            const itensHtml = pedido.itens.map(function (item) {
                return `<li>${item.produto_nome} — ${item.quantidade}x (R$ ${Number(item.preco_unitario).toFixed(2).replace(".", ",")})</li>`;
            }).join("");

            return `
                <div class="pedido-admin">
                    <p><strong>Pedido #${pedido.id}</strong> — ${pedido.nome_cliente} — R$ ${Number(pedido.total).toFixed(2).replace(".", ",")} — <em>${pedido.status}</em></p>
                    <ul>${itensHtml}</ul>
                </div>
            `;
        }).join("");
    }

    carregarProdutos();
    carregarPedidos();
});
