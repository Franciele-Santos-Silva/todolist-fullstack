# Explicação Super Detalhada do Frontend da TodoList Fullstack

Este documento fornece uma explicação **super detalhada** de cada componente do frontend React + Vite da aplicação TodoList. É uma SPA (Single Page Application) simples com CRUD de tarefas via API backend.

Estrutura:
1. **Arquitetura Geral**
2. **Dependências e Scripts (package.json)**
3. **Configuração Vite (vite.config.js)**
4. **HTML Base (index.html)**
5. **Entry Point (src/main.jsx)**
6. **Componente Principal (src/App.jsx)**
7. **Componente TaskRow (src/components/TaskRow.jsx)**
8. **Estilos (src/style.css e src/index.css)**
9. **Integração com Backend**
10. **Execução e Docker**
11. **Fluxo de Dados/UI**
12. **Pontos de Melhoria/Observações**

## 1. Arquitetura Geral
- **Tecnologias**: React 19 (hooks funcionais), Vite (build/dev server), CSS vanilla.
- **Padrão**: Componentes funcionais + hooks (useState, useEffect). Sem Redux/Context/Hooks custom (apesar de tabs sugerirem; código usa props drilling simples).
- **Estado**: Local em App.jsx (tasks array, newTask string).
- **UI**: Tabela responsiva com form add, edit inline, select status, botões ações.
- **Porta**: 5173 (Vite dev).
- **API**: Fetch para /tasks (proxied via Vite).

## 2. Dependências e Scripts (frontend/package.json)
```
{
  \"name\": \"frontend\",
  \"private\": true,
  \"version\": \"0.0.0\", 
  \"scripts\": {
    \"dev\": \"vite --host --port 5173\",    // Dev server, host 0.0.0.0 (Docker), porta 5173
    \"build\": \"vite build\",               // Build dist/
    \"lint\": \"eslint .\"                   // ESLint
  },
  \"dependencies\": {
    \"react\": \"^19.2.4\",
    \"react-dom\": \"^19.2.4\"
  },
  \"devDependencies\": {
    \"vite\": \"^7.3.1\",
    \"@vitejs/plugin-react\": \"^5.1.1\"     // HMR React
  }
}
```
- **React 19**: Hooks modernos, compiler (não usado aqui).
- **Vite 7**: Build ultra-rápido, proxy API.

## 3. Configuração Vite (frontend/vite.config.js)
```
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],  // Transforma JSX, HMR
  server: {
    proxy: {             // Proxy mágico para dev!
      "/tasks": {
        target: process.env.VITE_API_URL || "http://localhost:3333",  // Backend
        changeOrigin: true  // Muda Host header
      }
    }
  }
});
```
- **Proxy**: Requests frontend `/tasks` -> backend. Frontend chama `fetch('/tasks')` (relativo), Vite redireciona. Sem CORS issues!

## 4. HTML Base (frontend/index.html)
```
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lista de Tarefas</title>
  </head>
  <body>
    <div id="root"></div>                      <!-- React monta aqui -->
    <script type="module" src="/src/main.jsx"></script>  <!-- ES modules -->
  </body>
</html>
```
- **Module**: Vite ESM nativo.
- **Responsive**: Viewport meta.

## 5. Entry Point (frontend/src/main.jsx)
```
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";  // Global styles

ReactDOM.createRoot(document.getElementById("root")).render(  // React 18+ API
  <React.StrictMode>   // Dev checks (double render)
    <App />
  </React.StrictMode>
);
```
- **StrictMode**: Detecta side-effects, deprecated APIs.

## 6. Componente Principal (frontend/src/App.jsx)
Coração da app - estado + API + render table.

```
import React, { useEffect, useState } from "react";
import TaskRow from "./components/TaskRow";

const API_URL = "";  // Proxy Vite usa /tasks relativo!

const App = () => {
  const [tasks, setTasks] = useState([]);     // Lista tarefas do BD
  const [newTask, setNewTask] = useState(""); // Input nova tarefa

  const fetchTasks = async () => {  // GET /tasks
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const addTask = async (e) => {    // POST /tasks
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });
      setNewTask("");
      fetchTasks();  // Refresh
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const deleteTask = async (id) => { // DELETE /tasks/:id
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  const updateTask = async (id, title, status) => { // PUT /tasks/:id
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

  useEffect(() => {     // Carrega inicial
    fetchTasks();
  }, []);

  return (
    <main>                // UI simples
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
          {tasks.map((task) => (          // Props drilling
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
```
- **Estado local**: useState simples (sem Context/Reducer).
- **Optimistic?** Não - sempre refetch após mutate.
- **API_URL vazia**: Com proxy, `fetch('/tasks')` funcionaria melhor.

## 7. Componente TaskRow (frontend/src/components/TaskRow.jsx)
Linha editável da tabela.

```
import { useState } from "react";

const formatDate = (dateUTC) => {  // Util local
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
        {editing ? (                       // Inline edit
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
      <td>{formatDate(created_at)}</td>   // Format pt-BR
      <td>
        <select value={status} onChange={handleStatusChange}>  // Enum match BD
          <option value="pendente">pendente</option>
          <option value="em andamento">em andamento</option>
          <option value="concluida">concluída</option>
        </select>
      </td>
      <td>
        <button className="btn-action" onClick={() => setEditing(true)} title="Editar">✏️</button>
        <button className="btn-action" onClick={() => deleteTask(id)} title="Excluir">🗑️</button>
      </td>
    </tr>
  );
}
```
- **Estados locais**: editing, newTitle.
- **formatDate**: Converte UTC para pt-BR long/short.

## 8. Estilos (frontend/src/style.css)
Custom todo app (azul moderno).
```
body { background-color: #0099ff; font-family: 'Urbanist', sans-serif; }

main { background: white card, shadow, centered. }

.add-form { flex input + button +. }

table { collapse, striped rows. }

select { styled dropdown. }

.btn-action { orange edit, red delete icons. }
```
index.css: Vite defaults (dark/light scheme).

## 9. Integração com Backend
- **Fetch**: App.jsx CRUD para `${API_URL}/tasks`.
- **Proxy Vite**: /tasks -> localhost:3333 (no CORS).
- **Docker**: VITE_API_URL=http://backend:3333.

## 10. Execução e Docker
- **Dev**: `npm run dev` -> http://localhost:5173.
- **Build**: `npm run build` -> dist/.
- **Docker**: docker-compose up frontend (porta 5173).

## 11. Fluxo de Dados/UI
1. Mount: useEffect fetchTasks -> setTasks.
2. Add: form submit -> POST -> refetch.
3. Edit/Delete: TaskRow callbacks -> PUT/DELETE -> refetch pai.
4. Status: Select onChange -> PUT.

## 12. Pontos de Melhoria/Observações
- **Estado**: Use Context/Reducer para scale; TanStack Query para data fetching.
- **API_URL**: Hardcode '' + proxy OK, mas use import.meta.env.VITE_API_URL.
- **Erro UI**: console.error -> Toast (react-hot-toast).
- **Formas**: React Hook Form validação.
- **Components tabs**: Sidebar/TaskList etc. não existem (stubs?).
- **A11y**: aria-labels, keyboard nav.
- **Testes**: Vitest + React Testing Lib.
- **Mobile**: Table -> Cards em responsive.

Frontend minimalista, funcional. Perfeito para MVP!

Fim do documento.

