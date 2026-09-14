// Chave utilizada no LocalStorage
const CHAVE_ALUNOS = "educonecta_alunos";

// Elementos da interface
const formAluno = document.getElementById("form-aluno");
const tabelaAlunos = document.getElementById("tabela-alunos");
const btnSalvarAluno = document.getElementById("btn-salvar");
const btnCancelarAluno = document.getElementById("btn-cancelar");

// Evento disparado quando a página termina de carregar
document.addEventListener("DOMContentLoaded", () => {
  inicializarAlunos();
  listarAlunos();
});

// Carga inicial se não houver dados no LocalStorage
function inicializarAlunos() {
  if (!localStorage.getItem(CHAVE_ALUNOS)) {
    const dadosIniciais = [
      { id: 1, matricula: "202601", nome: "Carlos Eduardo Costa", email: "carlos@educonecta.com", curso: "Análise e Des. de Sistemas", status: "Ativo" },
      { id: 2, matricula: "202602", nome: "Beatriz Helena Lima", email: "beatriz@educonecta.com", curso: "Banco de Dados", status: "Ativo" }
    ];
    salvarAlunos(dadosIniciais);
  }
}

// Funções auxiliares para leitura e gravação no LocalStorage
function obterAlunos() {
  const dados = localStorage.getItem(CHAVE_ALUNOS);
  return dados ? JSON.parse(dados) : [];
}

function salvarAlunos(lista) {
  localStorage.setItem(CHAVE_ALUNOS, JSON.stringify(lista));
}

// READ (Consultar / Listar)
function listarAlunos() {
  const lista = obterAlunos();
  tabelaAlunos.innerHTML = "";

  if (lista.length === 0) {
    tabelaAlunos.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">Nenhum aluno cadastrado.</td></tr>';
    return;
  }

  lista.forEach(aluno => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td><strong>${aluno.matricula}</strong></td>
      <td>${aluno.nome}</td>
      <td>${aluno.email}</td>
      <td>${aluno.curso}</td>
      <td><span class="badge ${aluno.status === 'Ativo' ? 'bg-success' : 'bg-secondary'}">${aluno.status}</span></td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-primary me-1" onclick="carregarAlunoParaEdicao(${aluno.id})">
          <i class="bi bi-pencil-fill"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluirAluno(${aluno.id})">
          <i class="bi bi-trash-fill"></i>
        </button>
      </td>
    `;
    tabelaAlunos.appendChild(linha);
  });
}

// CREATE e UPDATE (Criar novo ou Alterar existente)
formAluno.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const id = document.getElementById("aluno-id").value;
  const matricula = document.getElementById("aluno-matricula").value.trim();
  const nome = document.getElementById("aluno-nome").value.trim();
  const email = document.getElementById("aluno-email").value.trim();
  const curso = document.getElementById("aluno-curso").value.trim();
  const status = document.getElementById("aluno-status").value;

  let lista = obterAlunos();

  if (id) {
    // UPDATE: busca o item pelo ID e altera os valores
    lista = lista.map(aluno => {
      if (aluno.id === Number(id)) {
        return { id: Number(id), matricula, nome, email, curso, status };
      }
      return aluno;
    });
  } else {
    // CREATE: cria um novo objeto com id único gerado por Date.now()
    const novoAluno = {
      id: Date.now(),
      matricula,
      nome,
      email,
      curso,
      status
    };
    lista.push(novoAluno);
  }

  salvarAlunos(lista);
  listarAlunos();
  cancelarEdicaoAluno();
});

// Preenche o formulário para edição
function carregarAlunoParaEdicao(id) {
  const lista = obterAlunos();
  const aluno = lista.find(item => item.id === id);
  if (!aluno) return;

  document.getElementById("aluno-id").value = aluno.id;
  document.getElementById("aluno-matricula").value = aluno.matricula;
  document.getElementById("aluno-nome").value = aluno.nome;
  document.getElementById("aluno-email").value = aluno.email;
  document.getElementById("aluno-curso").value = aluno.curso;
  document.getElementById("aluno-status").value = aluno.status;

  btnSalvarAluno.innerHTML = '<i class="bi bi-save me-1"></i> Atualizar Aluno';
  btnCancelarAluno.classList.remove("d-none");
}

// Limpa os campos e cancela o modo de edição
function cancelarEdicaoAluno() {
  formAluno.reset();
  document.getElementById("aluno-id").value = "";
  btnSalvarAluno.innerHTML = '<i class="bi bi-check-circle me-1"></i> Salvar Aluno';
  btnCancelarAluno.classList.add("d-none");
}

// DELETE (Excluir registro)
function excluirAluno(id) {
  if (confirm("Deseja realmente remover este aluno?")) {
    let lista = obterAlunos();
    lista = lista.filter(aluno => aluno.id !== id);
    salvarAlunos(lista);
    listarAlunos();
  }
}