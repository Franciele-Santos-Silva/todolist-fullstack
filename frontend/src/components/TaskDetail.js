import React, { useState, useEffect, useCallback } from "react";
import useTasks from "../hooks/useTasks";

function TaskDetail() {
  const {
    tarefaSelecionada: tarefa,
    atualizarTarefa,
    excluirTarefa,
  } = useTasks();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [lista, setLista] = useState("Pessoal");
  const [data, setData] = useState("");
  const [subtarefas, setSubtarefas] = useState([]);

  useEffect(() => {
    if (tarefa) {
      setTitulo(tarefa.titulo);
      setDescricao(tarefa.descricao);
      setLista(tarefa.lista);
      setData(tarefa.dataVencimento || "");
      setSubtarefas(tarefa.subtarefas || []);
    }
  }, [tarefa]);

  const salvarAlteracoes = useCallback(() => {
    if (tarefa) {
      atualizarTarefa({
        ...tarefa,
        titulo,
        descricao,
        lista,
        dataVencimento: data,
        subtarefas,
      });
      alert("Alterações salvas!");
    }
  }, [tarefa, titulo, descricao, lista, data, subtarefas, atualizarTarefa]);

  const adicionarSubtarefa = useCallback(() => {
    const novoTitulo = prompt("Digite o título da nova subtarefa:");
    if (novoTitulo) {
      setSubtarefas((prev) => [
        ...prev,
        { titulo: novoTitulo, concluida: false },
      ]);
    }
  }, []);

  const toggleSubtarefa = useCallback((index) => {
    setSubtarefas((prev) => {
      const novaLista = [...prev];
      novaLista[index].concluida = !novaLista[index].concluida;
      return novaLista;
    });
  }, []);

  if (!tarefa) return null;

  return (
    <aside className="task-detail">
      <h3>Tarefa:</h3>
      <p className="detail-title">{titulo}</p>

      <div>
        <label>Descrição:</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição da tarefa..."
        />
      </div>

      <div className="detail-row">
        <label>Lista</label>
        <select value={lista} onChange={(e) => setLista(e.target.value)}>
          <option>Pessoal</option>
          <option>Trabalho</option>
          <option>Lista 1</option>
        </select>
      </div>

      <div className="detail-row">
        <label>Data de vencimento</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>

      <h4>Subtarefas:</h4>
      <ul className="subtasks-list">
        {subtarefas.length > 0 ? (
          subtarefas.map((sub, i) => (
            <li key={i}>
              <input
                type="checkbox"
                checked={sub.concluida}
                onChange={() => toggleSubtarefa(i)}
              />{" "}
              {sub.titulo}
            </li>
          ))
        ) : (
          <li>Nenhuma subtarefa</li>
        )}
      </ul>
      <button className="add-subtask-btn" onClick={adicionarSubtarefa}>
        + Adicionar Nova Subtarefa
      </button>

      <div className="detail-actions">
        <button
          className="delete-task-btn"
          onClick={() => excluirTarefa(tarefa.id)}
        >
          Excluir Tarefa
        </button>
        <button className="save-changes-btn" onClick={salvarAlteracoes}>
          Salvar alterações
        </button>
      </div>
    </aside>
  );
}

export default TaskDetail;
