import { useState } from "react";

const formatDate = (dateUTC) => {
  const options = { dateStyle: "long", timeStyle: "short" };
  return new Date(dateUTC).toLocaleString("pt-br", options);
};

export default function TaskRow({ task, deleteTask, updateTask }) {
  const { id, title, created_at, status } = task;

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert("O título não pode estar vazio!");
    updateTask(id, newTitle, status);
    setEditing(false);
  };

  const handleStatusChange = (e) => {
    updateTask(id, title, e.target.value);
  };

  return (
    <tr>
      <td>
        {editing ? (
          <form onSubmit={handleSubmit}>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </form>
        ) : (
          title
        )}
      </td>
      <td>{formatDate(created_at)}</td>
      <td>
        <select value={status} onChange={handleStatusChange}>
          <option value="pendente">pendente</option>
          <option value="em andamento">em andamento</option>
          <option value="concluida">concluída</option>
        </select>
      </td>
      <td>
        <button
          className="btn-action"
          onClick={() => setEditing(true)}
          title="Editar"
        >
          ✏️
        </button>
        <button
          className="btn-action"
          onClick={() => deleteTask(id)}
          title="Excluir"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}
