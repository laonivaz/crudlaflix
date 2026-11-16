function fazerLogin(event) {
    event.preventDefault();

    var email = document.getElementById('loginEmail').value;
    var senha = document.getElementById('loginSenha').value;

    fetch('/pessoas')
        .then(resposta => resposta.json())
        .then(dados => {
            const usuario = dados.find(p => p.email === email && p.senha === senha);

            if (usuario) {
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                window.location.href = 'get.html';
            } else {
                alert('Email ou senha inválidos!');
            }
        });
}