function buscarCEP(cep) {
    var cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        return;
    }

    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then(resposta => resposta.json())
        .then(dados => {
            if (!dados.erro) {
                document.getElementById('rua').value = dados.logradouro;
                document.getElementById('cidade').value = dados.localidade;
                document.getElementById('estado').value = dados.uf;
            } else {
                alert('CEP não encontrado.');
            }
        })
        .catch(() => alert('Erro ao consultar o CEP.'));
}

function enviarDados(event) {
    event.preventDefault();

    var novoUsuario = {
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        cpf: document.getElementById('identificadorCPF').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        rua: document.getElementById('rua').value,
        cep: document.getElementById('cep').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        telefone: document.getElementById('telefone').value,
        admin: false
    };

    fetch('/pessoas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoUsuario)
    })
    .then(resposta => resposta.json())
    .then(usuarioCriado => {
        sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioCriado));
        alert(`Cadastro realizado com sucesso! Bem-vindo(a), ${usuarioCriado.nome}!`);
        window.location.href = 'get.html';
    });
}