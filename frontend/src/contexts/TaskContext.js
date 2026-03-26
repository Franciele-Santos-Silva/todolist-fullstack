import React, { createContext, useContext, useState, useCallback } from "react";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
};

const initialTarefas = [
  // {
  //   id: 1,
  //   titulo: "Pesquisar",
  //   descricao: "",
  //   concluida: false,
  //   lista: "Pessoal",
  //   dataVencimento: "2022-03-20",
  //   etiquetas: ["Etiqueta 1"],
  //   subtarefas: [],
  // },
  // {
  //   id: 2,
  //   titulo: "Criar banco de dados de autores convidados",
  //   descricao: "",
  //   concluida: false,
  //   lista: "Trabalho",
  //   dataVencimento: "",
  //   etiquetas: [],
  //   subtarefas: [],
  // },
  // {
  //   id: 3,
  //   titulo: "Renovar carteira de motorista",
  //   descricao: "",
  //   concluida: true,
  //   lista: "Pessoal",
  //   dataVencimento: "2022-03-22",
  //   etiquetas: ["Etiqueta 2"],
  //   subtarefas: [{ titulo: "Ir ao DETRAN", concluida: false }],
  // },
  // {
  //   id: 4,
  //   titulo: "Consultar contador",
  //   descricao: "",
  //   concluida: false,
  //   lista: "Trabalho",
  //   dataVencimento: "",
  //   etiquetas: [],
  //   subtarefas: [
  //     { titulo: "Enviar documentos", concluida: true },
  //     { titulo: "Agendar reunião", concluida: false },
  //   ],
  // },
  // {
  //   id: 5,
  //   titulo: "Imprimir cartão de visita",
  //   descricao: "",
  //   concluida: false,
  //   lista: "Pessoal",
  //   dataVencimento: "",
  //   etiquetas: [],
  //   subtarefas: [],
  // },
];

export const TaskProvider = ({ children }) => {
  const [tarefas, setTarefas] = useState(initialTarefas);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);

  const atualizarTarefa = useCallback((tarefaAtualizada) => {
    setTarefas((prev) =>
      prev.map((t) => (t.id === tarefaAtualizada.id ? tarefaAtualizada : t)),
    );
  }, []);

  const excluirTarefa = useCallback(
    (id) => {
      setTarefas((prev) => prev.filter((t) => t.id !== id));
      if (tarefaSelecionada?.id === id) setTarefaSelecionada(null);
    },
    [tarefaSelecionada?.id],
  );

  // const adicionarTarefa = useCallback(() => {
  //   const novoId =
  //     tarefas.length > 0 ? Math.max(...tarefas.map((t) => t.id)) + 1 : 1;
  //   const novaTarefa = {
  //     id: novoId,
  //     titulo: "Nova tarefa",
  //     descricao: "",
  //     concluida: false,
  //     lista: "Pessoal",
  //     dataVencimento: "",
  //     etiquetas: [],
  //     subtarefas: [],
  //   };
  //   setTarefas((prev) => [...prev, novaTarefa]);
  //   setTarefaSelecionada(novaTarefa);
  // }, [tarefas]);

 const adicionarTarefa = useCallback((titulo) => {
  if (!titulo || !titulo.trim()) return;

  const novoId =
    tarefas.length > 0 ? Math.max(...tarefas.map((t) => t.id)) + 1 : 1;

  const novaTarefa = {
    id: novoId,
    titulo,
    descricao: "",
    concluida: false,
    lista: "Pessoal",
    dataVencimento: "",
    etiquetas: [],
    subtarefas: [],
  };

  setTarefas((prev) => [...prev, novaTarefa]);
  setTarefaSelecionada(novaTarefa);
}, [tarefas]);

  const value = {
    tarefas,
    tarefaSelecionada,
    setTarefaSelecionada,
    atualizarTarefa,
    excluirTarefa,
    adicionarTarefa,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
