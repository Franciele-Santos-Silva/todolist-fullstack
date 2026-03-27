const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const getTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error("Falha ao buscar tarefas");
  return res.json();
};

export const createTask = async (task) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Falha ao criar tarefa");
  return res.json();
};

export const updateTask = async (id, task) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Falha ao atualizar tarefa");
  return res.json();
};

export const deleteTask = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Falha ao deletar tarefa");
};