import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within TaskProvider");
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tarefas, setTarefas] = useState([]);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);

  // Buscar tarefas do backend ao iniciar
  useEffect(() => {
    getTasks()
      .then(setTarefas)
      .catch((err) => console.error(err));
  }, []);

  const adicionarTarefa = useCallback(async (titulo) => {
    if (!titulo || !titulo.trim()) return;

    const novaTarefa = {
      titulo,
      descricao: "",
      concluida: false,
      lista: "Pessoal",
      dataVencimento: "",
      etiquetas: [],
      subtarefas: [],
    };

    try {
      const criada = await createTask(novaTarefa);
      setTarefas((prev) => [...prev, criada]);
      setTarefaSelecionada(criada);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const atualizarTarefa = useCallback(async (tarefaAtualizada) => {
    try {
      const atualizada = await updateTask(
        tarefaAtualizada.id,
        tarefaAtualizada,
      );
      if (tarefaSelecionada && tarefaSelecionada.id === atualizada.id) {
        setTarefaSelecionada(atualizada);
      }
      setTarefas((prev) =>
        prev.map((t) => (t.id === atualizada.id ? atualizada : t)),
      );
    } catch (err) {
      console.error(err);
    }
  }, [tarefaSelecionada]);

  const excluirTarefa = useCallback(
    async (id) => {
      try {
        await deleteTask(id);
        setTarefas((prev) => prev.filter((t) => t.id !== id));
        if (tarefaSelecionada?.id === id) setTarefaSelecionada(null);
      } catch (err) {
        console.error(err);
      }
    },
    [tarefaSelecionada?.id],
  );

  const value = {
    tarefas,
    tarefaSelecionada,
    setTarefaSelecionada,
    adicionarTarefa,
    atualizarTarefa,
    excluirTarefa,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
