

function fecharModalCadastro() {
    var modal = document.getElementById('modalCadastro');
    modal.classList.add('ocultar');
}


function mostrarModalCadastro() {
    var modal = document.getElementById('modalCadastro');
    modal.classList.remove('ocultar');
}

function adicionarIngrediente() {
    var tabela = document.getElementById('tabelaIngredientes');
    var ingrediente = document.getElementById('formIngredientes').value;
    if (ingrediente != '') {
        var listItem = document.createElement("li");
        listItem.innerHTML = ingrediente
        tabela.appendChild(listItem)
    }
}

function limparIngredientes() {
    var tabela = document.getElementById('tabelaIngredientes').innerHTML = "";

}


async function getData() {
    const url = "http://localhost:5000/receita/listar";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json.data
    } catch (error) {
        console.error(error.message);
    }
}


async function toggleLike(id) {
    const url = `http://localhost:5000/receita/like/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error(error.message);
    }
}


async function getReceita(id) {
    const url = `http://localhost:5000/receita/consulta/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        return json.data

    } catch (error) {
        console.error(error.message);
    }
}


async function excluirReceitaAPI(id) {
    const url = `http://localhost:5000/receita/excluir/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error(error.message);
    }
}


async function consultarReceitas() {
    var galeria = document.getElementById('galeria')
    galeria.innerHTML = ''

    const receitas = await getData()

    receitas.map((receita) => {
        const id = receita.id
        const nome = receita.nome
        const imagem = receita.imagemBase64
        const like = receita.like

        const divReceita = document.createElement("div");
        const html = `
                <div class="card" id="${id}">
                    <p class="cardTitle">${nome}</p>
                    <div class="divImg">
                        <img class="imagemComida" src="data:image/png;base64, ${imagem}">
                    </div>
                    <div class="botoes">
                        <a class="btCard" onclick="likeReceita(${id});"><img id='like' class="${like == true ? "like" : "icon"}" src="./assets/like.svg"></a>
                        <a class="btCard" onclick="mostrarModalCadastro();"><img id='editar' class="icon" src="./assets/editar.svg"></a>
                        <a class='btCard' onclick="excluirReceita(${id});"><img id='excluir' class="icon" src="./assets/excluir.svg"></a>
                    </div>
                </div>
        `
        divReceita.innerHTML = html
        galeria.appendChild(divReceita)
    })


}


async function excluirReceita(id) {
    await excluirReceitaAPI(id)
    consultarReceitas()
}

async function likeReceita(id) {
    await toggleLike(id)
    const receita = await getReceita(id)
    var cardReceita = document.getElementById(id)
    var botaoLike = cardReceita.querySelector('#like');
    if (receita.like == true) {
        botaoLike.classList.remove("icon")
        botaoLike.classList.add("like")
    } else {
        botaoLike.classList.remove("like")
        botaoLike.classList.add("icon")
    }
}
