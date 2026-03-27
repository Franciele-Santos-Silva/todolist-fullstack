import React from "react";
import { useTasks } from "./contexts/TaskContext";

const TestBackend = () => {
  const { tarefas, adicionarTarefa } = useTasks();

  return (
    <div>
      <h2>Teste de Backend</h2>
      <button onClick={() => adicionarTarefa("Tarefa de teste")}>
        Criar Tarefa de Teste
      </button>
      <ul>
        {tarefas.map(t => (
          <li key={t.id}>{t.titulo}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestBackend;