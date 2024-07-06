

function fecharModalCadastro() {
    var modal = document.getElementById('modalCadastro');
    modal.classList.remove('mostrar');
    modal.classList.add('ocultar');
}


function mostrarModalCadastro() {
    var modal = document.getElementById('modalCadastro');
    modal.classList.remove('ocultar');
    modal.classList.add('mostrar');

}

function adicionarIngrediente() {
    var tabela = document.getElementById('tabelaIngredientes');
    var ingrediente = document.getElementById('formIngredientes').value;
    if (ingrediente != '') {
        var listItem = document.createElement("li");
        listItem.innerHTML = ingrediente
        tabela.appendChild(listItem)
    }
    document.getElementById('formIngredientes').value = ""
}

function limparIngredientes() {
    document.getElementById('tabelaIngredientes').innerHTML = "";
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


async function criarReceitaApi(data) {
    const url = `http://localhost:5000/receita/cadastrar`;
    console.log(JSON.stringify(data))
    try {
        const response = await fetch(url,
            {
                headers: { 'Content-Type': 'application/json' },
                method: "POST",
                body: JSON.stringify(data)
            }
        );
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function editarReceitaApi(id, data) {
    const url = `http://localhost:5000/receita/editar/${id}`;
    console.log(JSON.stringify(data))
    try {
        const response = await fetch(url,
            {
                headers: { 'Content-Type': 'application/json' },
                method: "PUT",
                body: JSON.stringify(data)
            }
        );
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
                        <a class="btCard" onclick="editarReceita(${id})"><img id='editar' class="icon" src="./assets/editar.svg"></a>
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
    document.getElementById(id).remove()
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


function modalCadastroLimpo() {
    const modalCadastro = document.getElementById("modalCadastro")
    modalCadastro.innerHTML = `
        <a onClick="fecharModalCadastro();"><img id='fechar' class="icon" src="./assets/close.svg"></a>
        <p>Cadastro de Receita</p>
        <div class="divForm">
            <p>Nome</p>
            <input class="formInput" type="text" id="formNome" name="nome">
        </div>
        <div class="divForm">
            <p>Ingredientes</p>
            <input class="formInput" type="text" id="formIngredientes" name="ingredientes">
            <a onclick="adicionarIngrediente();" title="Adicionar Ingrediente">
                <img id='addIngrediente' class="icon" src="./assets/adicionar.svg">
            </a>
            <a onclick="limparIngredientes();" title="Limpar Lista">
                <img id='limparIngredientes' class="icon" src="./assets/remover.svg">
            </a>
        </div>
        <div class="divForm">
            <p>Imagem</p>
            <input class="formInput" type="file" id="formImagem" name="imagem" accept="image/png, image/jpeg" />
        </div>
        <div class="formDetalhes">
            <div class="formLista">
                <p>Lista</p>
                <ul id="tabelaIngredientes">

                </ul>
            </div>
            <div class="divForm formDescricao">
                <p>Descrição</p>
                <textarea id="formText" name="descricao"></textarea>
            </div>
        </div>
        <a class="formCadastrar" onclick="salvarReceita();">
            Salvar
        </a>
        `
    mostrarModalCadastro()
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/?[A-z]*;base64,/);
}


function gerarListaIngredientes(ul) {
    return Array.from(ul.getElementsByTagName("li"), tag => { return { nome: tag.innerHTML } })
}


async function salvarReceita() {
    const nome = document.getElementById("formNome").value
    const descricao = document.getElementById("formText").value
    const listaIngredientes = document.getElementById("tabelaIngredientes")
    const ingredientes = gerarListaIngredientes(listaIngredientes)
    const body = {
        nome,
        descricao,
        ingredientes,
        "imagemBase64": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
        "like": false,
    }
    await criarReceitaApi(body)
    fecharModalCadastro()
    consultarReceitas()
}


async function salvarEdicaoReceita(id) {
    const nome = document.getElementById("formNome").value
    const descricao = document.getElementById("formText").value
    const listaIngredientes = document.getElementById("tabelaIngredientes")
    const ingredientes = gerarListaIngredientes(listaIngredientes)
    const body = {
        nome,
        descricao,
        ingredientes,
        "imagemBase64": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
        "like": false,
    }
    await editarReceitaApi(id, body)
    fecharModalCadastro()
    consultarReceitas()
}

async function editarReceita(id) {
    const receita = await getReceita(id)
    const modalCadastro = document.getElementById("modalCadastro")
    modalCadastro.innerHTML = `
        <a onClick="fecharModalCadastro();"><img id='fechar' class="icon" src="./assets/close.svg"></a>
        <p>Cadastro de Receita</p>
        <div class="divForm">
            <p>Nome</p>
            <input class="formInput" type="text" id="formNome" name="nome">
        </div>
        <div class="divForm">
            <p>Ingredientes</p>
            <input class="formInput" type="text" id="formIngredientes" name="ingredientes">
            <a onclick="adicionarIngrediente();" title="Adicionar Ingrediente">
                <img id='addIngrediente' class="icon" src="./assets/adicionar.svg">
            </a>
            <a onclick="limparIngredientes();" title="Limpar Lista">
                <img id='limparIngredientes' class="icon" src="./assets/remover.svg">
            </a>
        </div>
        <div class="divForm">
            <p>Imagem</p>
            <input class="formInput" type="file" id="formImagem" name="imagem" accept="image/png, image/jpeg" />
        </div>
        <div class="formDetalhes">
            <div class="formLista">
                <p>Lista</p>
                <ul id="tabelaIngredientes">

                </ul>
            </div>
            <div class="divForm formDescricao">
                <p>Descrição</p>
                <textarea id="formText" name="descricao">${receita.descricao}</textarea>
            </div>
        </div>
        <a class="formCadastrar" onclick="salvarEdicaoReceita(${id});">
            Salvar
        </a>
        `
    document.getElementById("formNome").value = receita.nome
    const tabelaIngredientes = document.getElementById("tabelaIngredientes")
    receita.ingredientes.map((ingrediente) => {
        const item = document.createElement("li")
        item.innerHTML = ingrediente.nome
        tabelaIngredientes.appendChild(item)
    })
    mostrarModalCadastro()

}

