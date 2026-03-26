import React from 'react';
import useTasks from '../hooks/useTasks';

function TaskItem({ tarefa, selecionada }) {
  const { setTarefaSelecionada, atualizarTarefa } = useTasks();

  const toggleConcluida = () => {
    atualizarTarefa({ ...tarefa, concluida: !tarefa.concluida });
  };

  return (
    <li className={`task-item ${tarefa.concluida ? 'completed' : ''} ${selecionada ? 'selected' : ''}`}>
      <input type="checkbox" checked={tarefa.concluida} onChange={toggleConcluida} />
      <span className="task-title" onClick={() => setTarefaSelecionada(tarefa)}>{tarefa.titulo}</span>
      <button className="task-arrow" onClick={() => setTarefaSelecionada(tarefa)}></button>
    </li>
  );
}

export default TaskItem;
