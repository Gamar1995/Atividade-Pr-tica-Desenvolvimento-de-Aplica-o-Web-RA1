const CHAVE_CURSOS = "educonecta_cursos";

const formCurso = document.getElementById("form-curso");
const tabelaCursos = document.getElementById("tabela-cursos");
const btnSalvarCurso = document.getElementById("btn-salvar");
const btnCancelarCurso = document.getElementById("btn-cancelar");

document.addEventListener("DOMContentLoaded", () => {
  inicializarCursos();
  listarCursos();
});

function inicializarCursos() {
  if (!localStorage.getItem(CHAVE_CURSOS)) {
    const dadosIniciais = [
      { id: 1, nome: "Engenharia de Software", carga: 360, modalidade: "Presencial", descricao: "Arquitetura de sistemas e engenharia de requisitos." },
      { id: 2, nome: "Modelagem Relacional de Dados", carga: 120, modalidade: "EaD", descricao: "Normalização de dados, SQL DDL/DML e integridade." }
    ];
    salvarCursos(dadosIniciais);
  }
}

function obterCursos() {
  const dados = localStorage.getItem(CHAVE_CURSOS);
  return dados ? JSON.parse(dados) : [];
}

function salvarCursos(lista) {
  localStorage.setItem(CHAVE_CURSOS, JSON.stringify(lista));
}

function listarCursos() {
  const lista = obterCursos();
  tabelaCursos.innerHTML = "";

  if (lista.length === 0) {
    tabelaCursos.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">Nenhum curso cadastrado.</td></tr>';
    return;
  }

  lista.forEach(curso => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td><strong>${curso.nome}</strong></td>
      <td>${curso.carga} h</td>
      <td><span class="badge bg-info text-dark">${curso.modalidade}</span></td>
      <td>${curso.descricao}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-warning me-1" onclick="carregarCursoParaEdicao(${curso.id})">
          <i class="bi bi-pencil-fill"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluirCurso(${curso.id})">
          <i class="bi bi-trash-fill"></i>
        </button>
      </td>
    `;
    tabelaCursos.appendChild(linha);
  });
}

formCurso.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const id = document.getElementById("curso-id").value;
  const nome = document.getElementById("curso-nome").value.trim();
  const carga = Number(document.getElementById("curso-carga").value);
  const modalidade = document.getElementById("curso-modalidade").value;
  const descricao = document.getElementById("curso-descricao").value.trim();

  let lista = obterCursos();

  if (id) {
    lista = lista.map(curso => {
      if (curso.id === Number(id)) {
        return { id: Number(id), nome, carga, modalidade, descricao };
      }
      return curso;
    });
  } else {
    const novoCurso = {
      id: Date.now(),
      nome,
      carga,
      modalidade,
      descricao
    };
    lista.push(novoCurso);
  }

  salvarCursos(lista);
  listarCursos();
  cancelarEdicaoCurso();
});

function carregarCursoParaEdicao(id) {
  const lista = obterCursos();
  const curso = lista.find(item => item.id === id);
  if (!curso) return;

  document.getElementById("curso-id").value = curso.id;
  document.getElementById("curso-nome").value = curso.nome;
  document.getElementById("curso-carga").value = curso.carga;
  document.getElementById("curso-modalidade").value = curso.modalidade;
  document.getElementById("curso-descricao").value = curso.descricao;

  btnSalvarCurso.innerHTML = '<i class="bi bi-save me-1"></i> Atualizar Curso';
  btnCancelarCurso.classList.remove("d-none");
}

function cancelarEdicaoCurso() {
  formCurso.reset();
  document.getElementById("curso-id").value = "";
  btnSalvarCurso.innerHTML = '<i class="bi bi-check-circle me-1"></i> Salvar Curso';
  btnCancelarCurso.classList.add("d-none");
}

function excluirCurso(id) {
  if (confirm("Deseja realmente remover este curso?")) {
    let lista = obterCursos();
    lista = lista.filter(curso => curso.id !== id);
    salvarCursos(lista);
    listarCursos();
  }
}