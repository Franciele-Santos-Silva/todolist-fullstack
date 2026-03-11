import React, { useEffect, useState } from "react";
import TaskRow from "./components/TaskRow";

const API_URL = "";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });
      setNewTask("");
      fetchTasks();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  const updateTask = async (id, title, status) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main>
      <h1 style={{ textAlign: "center" }}>Lista de Tarefas</h1>
      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Adicionar tarefa"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">+</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Tarefa</th>
            <th>Data</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default App;