function verificarBoasVindas() {
    var dados = sessionStorage.getItem('usuarioLogado');

    if (!dados) {
        window.location.href = 'index.html';
        return;
    }

    var usuario = JSON.parse(dados);
    document.getElementById('msgBoasVindas').innerText = `Bem-vindo à Laflix, ${usuario.nome}!`;

    if (usuario.admin === true) {
        document.getElementById('linkAdmin').style.display = 'inline';
    }
}

function sair() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}