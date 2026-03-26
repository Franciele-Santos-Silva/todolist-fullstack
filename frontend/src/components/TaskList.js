import React, { useState } from "react";
import useTasks from "../hooks/useTasks";
import { contarPendentesHoje } from "../utils/taskUtils";
import TaskItem from "./TaskItem";

function TaskList() {
  const { tarefas, tarefaSelecionada, adicionarTarefa } = useTasks();
  const [novoTitulo, setNovoTitulo] = useState("");

  const pendentesHoje = contarPendentesHoje(tarefas);

  const handleAdicionar = () => {
    if (!novoTitulo.trim()) return;
    adicionarTarefa(novoTitulo);
    setNovoTitulo("");
  };

  return (
    <main className="tasks-main">
      <header className="tasks-header">
        <h2>Hoje</h2>
        <span className="task-count">{pendentesHoje}</span>
      </header>

      <div className="add-task">
        <input
          type="text"
          placeholder="Digite uma nova tarefa..."
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAdicionar();
            }
          }}
        />

        <button className="add-task-btn" onClick={handleAdicionar}>
          + Adicionar
        </button>
      </div>

      <ul className="tasks-list">
        {tarefas.map((tarefa) => (
          <TaskItem
            key={tarefa.id}
            tarefa={tarefa}
            selecionada={tarefaSelecionada?.id === tarefa.id}
          />
        ))}
      </ul>
    </main>
  );
}

export default TaskList;