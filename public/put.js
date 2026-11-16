function verificarAdmin() {
    var dados = sessionStorage.getItem('usuarioLogado');

    if (!dados) {
        window.location.href = 'index.html';
        return;
    }

    var usuario = JSON.parse(dados);
    if (usuario.admin !== true) {
        alert('Acesso negado! Apenas administradores podem acessar esta página.');
        window.location.href = 'get.html';
        return;
    }

    listarTodos();
}

function sair() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

function buscarCEPEdicao(cep) {
    var cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        return;
    }

    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then(resposta => resposta.json())
        .then(dados => {
            if (!dados.erro) {
                document.getElementById('ruaAtualizar').value = dados.logradouro;
                document.getElementById('cidadeAtualizar').value = dados.localidade;
                document.getElementById('estadoAtualizar').value = dados.uf;
            } else {
                alert('CEP não encontrado.');
            }
        });
}

function listarTodos() {
    document.getElementById('identificadorCPF').value = '';
    fetch('/pessoas')
        .then(resposta => resposta.json())
        .then(dados => preencherTabela(dados));
}

function buscarDados() {
    var cpf = document.getElementById('identificadorCPF').value;

    fetch('/pessoas')
        .then(resposta => resposta.json())
        .then(dados => {
            let filtrados = dados.filter(pessoa => pessoa.cpf.includes(cpf));
            preencherTabela(filtrados);
        });
}

function preencherTabela(dados) {
    var tabelaCorpo = document.getElementById('tabela-corpo');
    tabelaCorpo.innerHTML = '';

    dados.forEach(objeto => {
        // Se for administrador, exibe apenas Editar e o selo Admin (sem botão Apagar)
        var botoesAcao = objeto.admin === true
            ? `<button class="btn-azul" style="margin-top:0; padding:6px 10px;" onclick="carregarParaEditar(${objeto.id})">Editar</button>
               <span class="tag-protegido">Admin</span>`
            : `<button class="btn-azul" style="margin-top:0; padding:6px 10px;" onclick="carregarParaEditar(${objeto.id})">Editar</button>
               <button style="margin-top:0; padding:6px 10px;" onclick="deletarDados(${objeto.id}, ${objeto.admin})">Apagar</button>`;

        var tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${objeto.id}</td>
            <td>${objeto.nome || ''}</td>
            <td>${objeto.sobrenome || ''}</td>
            <td>${objeto.cpf || ''}</td>
            <td>${objeto.email || ''}</td>
            <td>${objeto.cidade || ''}/${objeto.estado || ''}</td>
            <td>${objeto.telefone || ''}</td>
            <td>${botoesAcao}</td>
        `;
        tabelaCorpo.appendChild(tr);
    });
}

function carregarParaEditar(id) {
    fetch(`/pessoas/${id}`)
        .then(resposta => resposta.json())
        .then(pessoa => {
            document.getElementById('identificador').value = pessoa.id;
            document.getElementById('adminAtualizar').value = pessoa.admin ? 'true' : 'false';
            document.getElementById('nomeAtualizar').value = pessoa.nome || '';
            document.getElementById('sobrenomeAtualizar').value = pessoa.sobrenome || '';
            document.getElementById('cpfAtualizar').value = pessoa.cpf || '';
            document.getElementById('emailAtualizar').value = pessoa.email || '';
            document.getElementById('senhaAtualizar').value = pessoa.senha || '';
            document.getElementById('ruaAtualizar').value = pessoa.rua || '';
            document.getElementById('cepAtualizar').value = pessoa.cep || '';
            document.getElementById('cidadeAtualizar').value = pessoa.cidade || '';
            document.getElementById('estadoAtualizar').value = pessoa.estado || '';
            document.getElementById('telefoneAtualizar').value = pessoa.telefone || '';

            document.getElementById('areaEdicao').style.display = 'block';
        });
}

function fecharEdicao() {
    document.getElementById('areaEdicao').style.display = 'none';
}

function atualizarDados() {
    var id = document.getElementById('identificador').value;

    var dadosEditados = {
        nome: document.getElementById('nomeAtualizar').value,
        sobrenome: document.getElementById('sobrenomeAtualizar').value,
        cpf: document.getElementById('cpfAtualizar').value,
        email: document.getElementById('emailAtualizar').value,
        senha: document.getElementById('senhaAtualizar').value,
        rua: document.getElementById('ruaAtualizar').value,
        cep: document.getElementById('cepAtualizar').value,
        cidade: document.getElementById('cidadeAtualizar').value,
        estado: document.getElementById('estadoAtualizar').value,
        telefone: document.getElementById('telefoneAtualizar').value,
        admin: document.getElementById('adminAtualizar').value === 'true'
    };

    fetch(`/pessoas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosEditados)
    })
    .then(resposta => resposta.json())
    .then(() => {
        alert('Usuário atualizado com sucesso!');
        fecharEdicao();
        listarTodos();
    });
}

function deletarDados(id, isAdmin) {
    if (isAdmin === true) {
        alert('A conta do administrador não pode ser apagada!');
        return;
    }

    if (confirm('Deseja realmente apagar este usuário?')) {
        fetch(`/pessoas/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert('Pessoa deletada com sucesso!');
            listarTodos();
        });
    }
}