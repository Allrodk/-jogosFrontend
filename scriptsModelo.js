// buscar o elemento no html da minha lista onde irei inserir as vagas
const lista = document.getElementById("lista");

// atribuindo a endpoint da api do backend em um constante
const apiUrl = "http://localhost:3000";

// modo edicao e id edicao
let edicao = false;
let idEdicao = 0;

// pegar os dados que o usuario digita no input (Elementos)
let titulo = document.getElementById("titulo");
let genero = document.getElementById("genero");
let imagem = document.getElementById("imagem");
let nota = document.getElementById("nota");
let jogado = document.getElementById("jogado");

// faz uma resquisicao do tipo [GET] para o back que recebe todas as vagas cadastradas
const getVagas = async () => {
  // FETCH API api do javascript responsavel por fazer comunicacao entre requicoes http.
  // faz uma requisicao [GET] para o backend na url http://localhost:3000/vagas
  const response = await fetch(apiUrl);
  // é a lista de objetos vagas (array de objetos)
  const jogos = await response.json();

  console.log(jogos);

  // a gente pega o resultado da api(um array de objetos com as vagas) e itera essa lista com o map
  // algo parecido com um for.
  jogos.map((jogo) => {
    lista.insertAdjacentHTML(
      "beforeend",
      `
        <div class="col">
            <div class="card">
            <img src="${jogo.imagem}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${jogo.titulo} - ${jogo.genero}</h5>
                <span class="badge bg-primary">${jogo.nota}</span>
                <p class="card-text">${jogo.jogado}</p>               
                <div>
                    <button class="btn btn-primary" onclick="editJogo('${jogo.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteJogo('${jogo.id}')">Excluir</button>
                </div>
            </div>
            </div>
        </div>
        `
    );
  });
};

// [POST] envia uma vaga para o backend para ser cadastrada

const submitForm = async (event) => {
  // previnir que o navegador atualiza a pagina por causa o evento de submit
  event.preventDefault();

  // Estamos construindo um objeto com os valores que estamos pegando no input.
  const jogo = {
    titulo: titulo.value,
    genero: genero.value,
    imagem: imagem.value,
    nota: parseInt(nota.value),
    jogado: jogado.value,    
  };
  // é o objeto preenchido com os valores digitados no input

  if (edicao) {
    putVaga(jogo, idEdicao);
  } else {
    createVaga(jogo);
  }

  clearFields();
  lista.innerHTML = "";
};

const createVaga = async (jogo) => {
  // estou construindo a requisicao para ser enviada para o backend.
  const request = new Request(`${apiUrl}/add`, {
    method: "POST",
    body: JSON.stringify(jogo),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
  const response = await fetch(request);

  const result = await response.json();
  // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
  alert(result.message);
  // vaga cadastrada com sucesso.
  getVagas();
};

const putVaga = async (jogo, id) => {
  // estou construindo a requisicao para ser enviada para o backend.
  const request = new Request(`${apiUrl}/editar/${id}`, {
    method: "PUT",
    body: JSON.stringify(jogo),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
  const response = await fetch(request);

  const result = await response.json();
  // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
  alert(result.message);
  edicao = false;
  idEdicao = 0;
  getVagas();
};

// [DELETE] funcao que exclui um vaga de acordo com o seu id
const deleteJogo = async (id) => {
  // construir a requiscao de delete
  const request = new Request(`${apiUrl}/deletar/${id}`, {
    method: "DELETE",
  });

  const response = await fetch(request);
  const result = await response.json();

  alert(result.message);

  lista.innerHTML = "";
  getVagas();
};

// [GET] /Vaga/{id} - funcao onde recebe um id via paramtero envia uma requisicao para o backend
// e retorna a vaga de acordo com esse id.
const getVagaById = async (id) => {
  const response = await fetch(`${apiUrl}/${id}`);
  return await response.json();
};

// ao clicar no botao editar
// ela vai preencher os campos dos inputs
// para montar o objeto para ser editado
const editJogo = async (id) => {
  // habilitando o modo de edicao e enviando o id para variavel global de edicao.
  edicao = true;
  idEdicao = id;

  //precismo buscar a informacao da vaga por id para popular os campos
  // salva os dados da vaga que vamos editar na variavel vaga.
  const jogo = await getVagaById(id);

  //preencher os campos de acordo com a vaga que vamos editar.
  titulo.value = jogo.titulo;
  genero.value = jogo.genero;
  imagem.value = jogo.imagem;
  nota.value = jogo.nota;
  jogado.value = jogo.jogado;
};

const clearFields = () => {
  titulo.value = "";
  genero.value = "";
  imagem.value = "";
  nota.value = "";
  jogado.value = "";
};

getVagas();
