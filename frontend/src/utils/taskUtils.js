export const gerarNovaTarefa = (tarefas = []) => {
  const novoId =
    tarefas.length > 0 ? Math.max(...tarefas.map((t) => t.id)) + 1 : 1;
  return {
    id: novoId,
    titulo: "Nova tarefa",
    descricao: "",
    concluida: false,
    lista: "Pessoal",
    dataVencimento: "",
    etiquetas: [],
    subtarefas: [],
  };
};

export const contarPendentesHoje = (tarefas) => {
  return tarefas.filter((t) => !t.concluida).length;
};
