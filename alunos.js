
// 1. Referencia de HTML


// Nome da chave onde os dados ficarão gravados no LocalStorage do navegador
const CHAVE_ALUNOS = "educonecta_alunos";

// Pega os elementos visuais do HTML pelos seus IDs para ser alterados 
const formAluno = document.getElementById("form-aluno");
const tabelaAlunos = document.getElementById("tabela-alunos");
const btnSalvarAluno = document.getElementById("btn-salvar");
const btnCancelarAluno = document.getElementById("btn-cancelar");

// 2. Inicio 

// Aguarda a tela carregar por completo antes de rodar o código
document.addEventListener("DOMContentLoaded", () => {
  inicializarAlunos(); // Cria dados de teste caso o banco esteja vazio
  listarAlunos();      // Mostra os alunos na tabela logo ao abrir a página
});

// Se for a primeira vez que a página abre, insere 2 alunos de exemplo
function inicializarAlunos() {
  if (!localStorage.getItem(CHAVE_ALUNOS)) {
    const dadosIniciais = [
      { id: 1, matricula: "123456", nome: "Pedrinho", email: "emaildeteste@email.com", curso: "Análise e Des. de Sistemas", status: "Ativo" },
      { id: 2, matricula: "54321", nome: "Joaozinho", email: "emaildeteste2@email.com", curso: "Eng. Software", status: "Ativo" }
    ];
    salvarAlunos(dadosIniciais);
  }
}

// 3. Localstorage


// Busca o texto salvo no LocalStorage e converte de volta para lista de objetos
function obterAlunos() {
  const dados = localStorage.getItem(CHAVE_ALUNOS);
  return dados ? JSON.parse(dados) : [];
}

// Converte a lista de objetos para texto puro e grava no LocalStorage
function salvarAlunos(lista) {
  localStorage.setItem(CHAVE_ALUNOS, JSON.stringify(lista));
}

// 4. ler e exibir dados


function listarAlunos() {
  const lista = obterAlunos(); // Carrega os dados atualizados
  tabelaAlunos.innerHTML = ""; // Limpa a tabela para não duplicar linhas ao recarregar

  // Mensagem caso não exista nenhum registro
  if (lista.length === 0) {
    tabelaAlunos.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">Nenhum aluno cadastrado.</td></tr>';
    return;
  }

  // Le cada aluno da lista e monta uma linha dentro da tabela
  lista.forEach(aluno => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td><strong>${aluno.matricula}</strong></td>
      <td>${aluno.nome}</td>
      <td>${aluno.email}</td>
      <td>${aluno.curso}</td>
      <td><span class="badge ${aluno.status === 'Ativo' ? 'bg-success' : 'bg-secondary'}">${aluno.status}</span></td>
      <td class="text-center">
        <!-- Botão que envia o ID do aluno para a função de editar -->
        <button class="btn btn-sm btn-outline-primary me-1" onclick="carregarAlunoParaEdicao(${aluno.id})">
          <i class="bi bi-pencil-fill"></i>
        </button>
        <!-- Botão que envia o ID do aluno para a função de excluir -->
        <button class="btn btn-sm btn-outline-danger" onclick="excluirAluno(${aluno.id})">
          <i class="bi bi-trash-fill"></i>
        </button>
      </td>
    `;
    tabelaAlunos.appendChild(linha);
  });
}

// 5. Salvação e atualização

formAluno.addEventListener("submit", (evento) => {
  evento.preventDefault(); // Impede a página de recarregar sozinha ao enviar o formulário

  // Le os valores digitados nos campos do formulário
  const id = document.getElementById("aluno-id").value;
  const matricula = document.getElementById("aluno-matricula").value.trim();
  const nome = document.getElementById("aluno-nome").value.trim();
  const email = document.getElementById("aluno-email").value.trim();
  const curso = document.getElementById("aluno-curso").value.trim();
  const status = document.getElementById("aluno-status").value;

  let lista = obterAlunos();

  if (id) {
    // Le o ID caso exista
    // Procura o aluno pelo ID e substitui seus dados antigos pelos novos
    lista = lista.map(aluno => {
      if (aluno.id === Number(id)) {
        return { id: Number(id), matricula, nome, email, curso, status };
      }
      return aluno;
    });
  } else {
    // Cria novo cadastro se não houver um
    // O Date.now() gera um número único para servir de ID primário
    const novoAluno = {
      id: Date.now(),
      matricula,
      nome,
      email,
      curso,
      status
    };
    lista.push(novoAluno); // Adiciona o novo aluno no final da lista
  }

  salvarAlunos(lista);       // Grava a lista atualizada no LocalStorage
  listarAlunos();            // Atualiza a tabela na tela
  cancelarEdicaoAluno();     // Limpa o formulário e reseta os botões
});

// 6. Edição

function carregarAlunoParaEdicao(id) {
  const lista = obterAlunos();
  const aluno = lista.find(item => item.id === id); // Localiza o aluno pelo ID
  if (!aluno) return;

  // Joga os dados do aluno de volta para dentro das caixas do formulário
  document.getElementById("aluno-id").value = aluno.id;
  document.getElementById("aluno-matricula").value = aluno.matricula;
  document.getElementById("aluno-nome").value = aluno.nome;
  document.getElementById("aluno-email").value = aluno.email;
  document.getElementById("aluno-curso").value = aluno.curso;
  document.getElementById("aluno-status").value = aluno.status;

  // Modifica o texto do botão principal e faz o botão 'Cancelar' aparecer
  btnSalvarAluno.innerHTML = '<i class="bi bi-save me-1"></i> Atualizar Aluno';
  btnCancelarAluno.classList.remove("d-none");
}

// 7. Limpeza da edição

function cancelarEdicaoAluno() {
  formAluno.reset();                         // Limpa todos os campos de texto
  document.getElementById("aluno-id").value = ""; // Esvazia o campo de ID oculto
  btnSalvarAluno.innerHTML = '<i class="bi bi-check-circle me-1"></i> Salvar Aluno';
  btnCancelarAluno.classList.add("d-none");   // Esconde o botão de cancelar novamente
}

// 8. Apagar

function excluirAluno(id) {
  // Pede confirmação antes de apagar
  if (confirm("Deseja realmente remover este aluno?")) {
    let lista = obterAlunos();
    // Cria uma nova lista mantendo apenas quem tem ID diferente do que foi clicado
    lista = lista.filter(aluno => aluno.id !== id);
    salvarAlunos(lista); // Salva a lista sem o registro excluído
    listarAlunos();      // Redesenha a tabela na tela
  }
}