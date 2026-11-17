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
    if (!formulario) return;

    function esc(texto) {
        const d = document.createElement("div");
        d.textContent = texto ?? "";
        return d.innerHTML;
    }

    function carregarProdutos() {
        fetch("/api/produtos").then(function (r) { return r.json(); }).then(renderizarTabela)
            .catch(function () { corpoTabela.innerHTML = '<tr><td colspan="5">Erro ao carregar produtos.</td></tr>'; });
    }

    function renderizarTabela(produtos) {
        corpoTabela.innerHTML = "";
        if (!produtos.length) {
            corpoTabela.innerHTML = '<tr><td colspan="5">Nenhum produto cadastrado.</td></tr>';
            return;
        }
        produtos.forEach(function (produto) {
            const linha = document.createElement("tr");
            linha.innerHTML = '<td>' + produto.id + '</td><td>' + esc(produto.nome) + '</td><td>' + esc(produto.categoria) + '</td><td>R$ ' + Number(produto.preco).toFixed(2).replace(".", ",") + '</td><td><button type="button" class="btn-editar" data-id="' + produto.id + '">Editar</button><button type="button" class="btn-excluir remover" data-id="' + produto.id + '">Excluir</button></td>';
            corpoTabela.appendChild(linha);
        });
        document.querySelectorAll(".btn-editar").forEach(function (botao) {
            botao.addEventListener("click", function () {
                const produto = produtos.find(function (p) { return p.id == botao.dataset.id; });
                campoId.value = produto.id;
                campoNome.value = produto.nome;
                campoDescricao.value = produto.descricao || "";
                campoPreco.value = produto.preco;
                campoCategoria.value = produto.categoria;
                botaoSalvar.textContent = "Salvar alterações";
                botaoCancelar.hidden = false;
                campoNome.focus();
            });
        });
        document.querySelectorAll(".btn-excluir").forEach(function (botao) {
            botao.addEventListener("click", function () { excluirProduto(botao.dataset.id); });
        });
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
        const dados = { id: campoId.value || null, nome: campoNome.value.trim(),
            descricao: campoDescricao.value.trim(), preco: parseFloat(campoPreco.value),
            categoria: campoCategoria.value };
        const editando = Boolean(dados.id);
        fetch(editando ? "/api/produtos/" + dados.id : "/api/produtos", {
            method: editando ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        }).then(function (r) { return r.json(); }).then(function (resultado) {
            if (resultado.erro) {
                mensagem.classList.add("erro");
                mensagem.textContent = resultado.erro;
                return;
            }
            mensagem.classList.remove("erro");
            mensagem.textContent = resultado.mensagem;
            limparFormulario();
            carregarProdutos();
        }).catch(function () {
            mensagem.classList.add("erro");
            mensagem.textContent = "Erro de conexão com o servidor.";
        });
    });

    function excluirProduto(id) {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return;
        fetch("/api/produtos/" + id, { method: "DELETE" })
            .then(function (r) { return r.json(); }).then(function (resultado) {
                mensagem.classList.toggle("erro", Boolean(resultado.erro));
                mensagem.textContent = resultado.erro || resultado.mensagem;
                carregarProdutos();
                carregarPedidos();
            }).catch(function () {
                mensagem.classList.add("erro");
                mensagem.textContent = "Erro ao excluir produto.";
            });
    }

    function carregarPedidos() {
        fetch("/api/pedidos").then(function (r) { return r.json(); }).then(renderizarPedidos)
            .catch(function () { listaPedidosAdmin.innerHTML = "<p>Erro ao carregar pedidos.</p>"; });
    }

    const STATUS = ["Recebido", "Em preparo", "Pronto", "Entregue", "Cancelado"];
    const resumo = document.querySelector("#resumo-pedidos");
    function dinheiro(v) { return "R$ " + Number(v).toFixed(2).replace(".", ","); }

    function renderizarPedidos(pedidos) {
        const validos = pedidos.filter(function (p) { return p.status !== "Cancelado"; });
        const faturamento = validos.reduce(function (soma, p) { return soma + Number(p.total); }, 0);
        const abertos = pedidos.filter(function (p) { return p.status === "Recebido" || p.status === "Em preparo"; }).length;
        resumo.innerHTML = '<div><strong>' + pedidos.length + '</strong><span>pedidos</span></div><div><strong>' + abertos + '</strong><span>em aberto</span></div><div><strong>' + dinheiro(faturamento) + '</strong><span>faturamento</span></div>';
        if (!pedidos.length) {
            listaPedidosAdmin.innerHTML = "<p>Nenhum pedido registrado ainda.</p>";
            return;
        }
        listaPedidosAdmin.innerHTML = pedidos.map(function (pedido) {
            const itensHtml = pedido.itens.map(function (item) {
                return '<li>' + esc(item.produto_nome) + ' — ' + item.quantidade + 'x (R$ ' + Number(item.preco_unitario).toFixed(2).replace(".", ",") + ')</li>';
            }).join("");
            const opcoes = STATUS.map(function (s) {
                return '<option value="' + s + '"' + (s === pedido.status ? " selected" : "") + '>' + s + '</option>';
            }).join("");
            return '<div class="pedido-admin"><p><strong>Pedido #' + pedido.id + '</strong> — ' + esc(pedido.nome_cliente) + ' — R$ ' + Number(pedido.total).toFixed(2).replace(".", ",") + ' — <select class="select-status" data-id="' + pedido.id + '" aria-label="Status do pedido ' + pedido.id + '">' + opcoes + '</select></p><ul>' + itensHtml + '</ul></div>';
        }).join("");
        document.querySelectorAll(".select-status").forEach(function (sel) {
            sel.addEventListener("change", function () {
                fetch("/api/pedidos/" + sel.dataset.id + "/status", {
                    method: "PATCH", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: sel.value })
                }).then(function (r) { return r.json(); }).then(function (resultado) {
                    mensagem.classList.toggle("erro", Boolean(resultado.erro));
                    mensagem.textContent = resultado.erro || resultado.mensagem;
                    carregarPedidos();
                }).catch(function () {
                    mensagem.classList.add("erro");
                    mensagem.textContent = "Erro ao atualizar o status.";
                });
            });
        });
    }
    carregarProdutos();
    carregarPedidos();
});
