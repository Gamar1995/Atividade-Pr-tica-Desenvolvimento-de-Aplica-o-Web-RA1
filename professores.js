const CHAVE_PROFESSORES = "educonecta_professores";

const formProf = document.getElementById("form-professor");
const tabelaProfessores = document.getElementById("tabela-professores");
const btnSalvarProf = document.getElementById("btn-salvar");
const btnCancelarProf = document.getElementById("btn-cancelar");

document.addEventListener("DOMContentLoaded", () => {
  inicializarProfessores();
  listarProfessores();
});

function inicializarProfessores() {
  if (!localStorage.getItem(CHAVE_PROFESSORES)) {
    const dadosIniciais = [
      { id: 1, nome: "Dra. Ana Paula Mendes", email: "ana.mendes@educonecta.com", titulacao: "Doutor", area: "Banco de Dados Relacional", telefone: "(11) 98888-1111" },
      { id: 2, nome: "Me. Lucas Rocha", email: "lucas.rocha@educonecta.com", titulacao: "Mestre", area: "Desenvolvimento Web", telefone: "(11) 97777-2222" }
    ];
    salvarProfessores(dadosIniciais);
  }
}

function obterProfessores() {
  const dados = localStorage.getItem(CHAVE_PROFESSORES);
  return dados ? JSON.parse(dados) : [];
}

function salvarProfessores(lista) {
  localStorage.setItem(CHAVE_PROFESSORES, JSON.stringify(lista));
}

function listarProfessores() {
  const lista = obterProfessores();
  tabelaProfessores.innerHTML = "";

  if (lista.length === 0) {
    tabelaProfessores.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">Nenhum professor cadastrado.</td></tr>';
    return;
  }

  lista.forEach(prof => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td><strong>${prof.nome}</strong></td>
      <td><span class="badge bg-secondary">${prof.titulacao}</span></td>
      <td>${prof.area}</td>
      <td>${prof.email}</td>
      <td>${prof.telefone}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-success me-1" onclick="carregarProfParaEdicao(${prof.id})">
          <i class="bi bi-pencil-fill"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluirProfessor(${prof.id})">
          <i class="bi bi-trash-fill"></i>
        </button>
      </td>
    `;
    tabelaProfessores.appendChild(linha);
  });
}

formProf.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const id = document.getElementById("prof-id").value;
  const nome = document.getElementById("prof-nome").value.trim();
  const email = document.getElementById("prof-email").value.trim();
  const titulacao = document.getElementById("prof-titulacao").value;
  const area = document.getElementById("prof-area").value.trim();
  const telefone = document.getElementById("prof-telefone").value.trim();

  let lista = obterProfessores();

  if (id) {
    lista = lista.map(prof => {
      if (prof.id === Number(id)) {
        return { id: Number(id), nome, email, titulacao, area, telefone };
      }
      return prof;
    });
  } else {
    const novoProf = {
      id: Date.now(),
      nome,
      email,
      titulacao,
      area,
      telefone
    };
    lista.push(novoProf);
  }

  salvarProfessores(lista);
  listarProfessores();
  cancelarEdicaoProfessor();
});

function carregarProfParaEdicao(id) {
  const lista = obterProfessores();
  const prof = lista.find(item => item.id === id);
  if (!prof) return;

  document.getElementById("prof-id").value = prof.id;
  document.getElementById("prof-nome").value = prof.nome;
  document.getElementById("prof-email").value = prof.email;
  document.getElementById("prof-titulacao").value = prof.titulacao;
  document.getElementById("prof-area").value = prof.area;
  document.getElementById("prof-telefone").value = prof.telefone;

  btnSalvarProf.innerHTML = '<i class="bi bi-save me-1"></i> Atualizar Professor';
  btnCancelarProf.classList.remove("d-none");
}

function cancelarEdicaoProfessor() {
  formProf.reset();
  document.getElementById("prof-id").value = "";
  btnSalvarProf.innerHTML = '<i class="bi bi-check-circle me-1"></i> Salvar Professor';
  btnCancelarProf.classList.add("d-none");
}

function excluirProfessor(id) {
  if (confirm("Deseja realmente remover este professor?")) {
    let lista = obterProfessores();
    lista = lista.filter(prof => prof.id !== id);
    salvarProfessores(lista);
    listarProfessores();
  }
}