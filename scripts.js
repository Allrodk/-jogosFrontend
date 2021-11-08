// Elemento lista do HTML
const lista = document.getElementById("lista");

//Constante endpoint API do backend
const apiUrl = "https://jogosnft.herokuapp.com";
// const apiUrl = "http://localhost:3000";

//Modo de edição
let edicao = false;
let idEdicao = 0;

//Pegar do input HTML
let titulo = document.getElementById("titulo");
let genero = document.getElementById("genero");
let imagem = document.getElementById("imagem");
let nota = document.getElementById("nota");
let jogado = document.getElementById("jogado");

let listaCheia = true;

//Requisição GET para listar o jogos cadastrados no backend
const getJogos = async () => {
  // FETCH API = responsavel por comunicar requisições HTTP
  // Requisição GET para a url do backend
  const response = await fetch(apiUrl);
  const jogos = await response.json();
  console.log(jogos);

  let joguei = "";
  //Iterando resultado da API com map
  jogos.map((jogo) => {
    listaJogos(jogo, joguei);
  });
};

function listaJogos(jogo, joguei) {
  if (jogo.jogado == true) {
    joguei = "Joguei";
  } else {
    joguei = "Não joguei";
  }
  lista.insertAdjacentHTML(
    "beforeend",
    `              
    <div class="col">
        <div class="card">
            <img src="${jogo.imagem}" class="card-img-top" alt="...">
            <div class="card-body">                
                <div class="info">
                    <h5 class="card-title">${jogo.titulo} </h5>
                    <span class="badge bg-primary" id="card-nota">${jogo.nota}</span>
                </div>
                <div class="info">
                    <h5 class="card-text">Genero:</h5>
                    <p class="card-text">${jogo.genero}</p>
                </div>
                <p class="card-text">${joguei}</p>                                             
                <div>
                    <button class="btn btn-primary" onclick="editJogo('${jogo.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteJogo('${jogo.id}')">Excluir</button>
                </div>
            </div>
        </div>
    </div>
          
      `
  );
}
//------------------------------------------------------------------------

// POST envia um jogo para ser cadastrado no backend
const submitForm = async (event) => {
  //Não deixa o navegador atualizar a pagina por conta do evento submit
  event.preventDefault();

  //Construindo um objeto com valores do inputs
  const jogo = {
    titulo: titulo.value,
    genero: genero.value,
    imagem: imagem.value,
    nota: parseInt(nota.value),
    jogado: jogado.checked,
  };

  //Preenche o objeto com valores do input
  if (edicao) {
    putJogo(jogo, idEdicao);
  } else {
    createJogo(jogo);
  }

  clearFields();
  lista.innerHTML = "";
};

// POST ------------------------------------------------------------------------

const createJogo = async (jogo) => {
  //Requisição para enviar ao backend
  const request = new Request(`${apiUrl}/novo`, {
    method: "POST",
    body: JSON.stringify(jogo),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  const response = await fetch(request);

  // Exibir mensagem "Jogo cadastrado com sucesso."
  const result = await response.json();
  alert(result.message);

  getJogos();
};

// PUT ------------------------------------------------------------------------

const putJogo = async (jogo, id) => {
  //Requisição para enviar ao backend
  const request = new Request(`${apiUrl}/editar/${id}`, {
    method: "PUT",
    body: JSON.stringify(jogo),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  const response = await fetch(request);

  // Exibir mensagem "Jogo alterado com sucesso."
  const result = await response.json();
  alert(result.message);

  edicao = false;
  idEdicao = 0;

  getJogos();
};

// DELETE (excluão de jogo) -----------------------------------------------

const deleteJogo = async (id) => {
  const request = new Request(`${apiUrl}/deletar/${id}`, {
    method: "DELETE",
  });

  const response = await fetch(request);

  // Exibir mensagem "Jogo excluído com sucesso."
  const result = await response.json();
  alert(result.message);

  lista.innerHTML = "";
  getJogos();
};

// GET (Jogo/id) ----------------------------------------------------

const getJogoById = async (id) => {
  const response = await fetch(`${apiUrl}/${id}`);
  return await response.json();
};

// Função (Editar) ----------------------------------------------------

const editJogo = async (id) => {
  //habilitar modo edição
  edicao = true;
  idEdicao = id;

  // Buscar e salvar dados jogo por id
  const jogo = await getJogoById(id);

  //Preenche os campos de acordo com o jogo selecionado
  titulo.value = jogo.titulo;
  genero.value = jogo.genero;
  imagem.value = jogo.imagem;
  nota.value = jogo.nota;
  if (jogo.jogado == true) {
    jogado.checked = true;
  } else {
    jogado.checked = false;
  }
};

//Função para limpar Formlário
const clearFields = () => {
  titulo.value = "";
  genero.value = "";
  imagem.value = "";
  nota.value = "";
  jogado.checked = false;
};

getJogos();
