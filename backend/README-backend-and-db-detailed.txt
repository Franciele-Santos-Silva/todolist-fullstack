# Explicação Detalhada do Backend e Banco de Dados da TodoList Fullstack

Este documento fornece uma explicação **extremamente detalhada** de cada componente do backend Node.js e do banco de dados MySQL da aplicação TodoList. A estrutura segue o padrão MVC (Model-View-Controller) simplificado para uma API RESTful, sem views (pois é consumida pelo frontend). 

Vou dividir em seções: 
1. **Arquitetura Geral**
2. **Dependências (package.json)**
3. **Banco de Dados (database/init.sql)**
4. **Conexão com BD (models/connection.js)**
5. **Modelo de Tarefas (models/tasksModel.js)**
6. **Middlewares de Validação (middlewares/tasksMiddleware.js)**
7. **Controlador de Tarefas (controllers/tasksController.js)**
8. **Rotas (src/router.js)**
9. **Aplicação Express (src/app.js)**
10. **Servidor Principal (src/server.js)**
11. **Fluxo de Requisições (Exemplo)**
12. **Pontos de Melhoria/Observações**

## 1. Arquitetura Geral
- **Tecnologias**: Node.js com Express.js (framework web), MySQL (banco relacional).
- **Padrão**: MVC:
  - **Model**: models/ - Lógica de BD (queries SQL).
  - **Controller**: controllers/ - Lógica de negócio e respostas HTTP.
  - **\"View\"**: N/A (API JSON para frontend).
- **Middlewares**: Validações de campos em requests.
- **API Endpoints**:
  | Método | Endpoint     | Descrição              |
  |--------|--------------|------------------------|
  | GET    | /tasks       | Lista todas as tarefas |
  | POST   | /tasks       | Cria nova tarefa       |
  | DELETE | /tasks/:id   | Deleta tarefa por ID   |
  | PUT    | /tasks/:id   | Atualiza tarefa por ID |
- **Porta**: 3333 (ou env PORT).
- **Ambiente**: Usa .env para credenciais MySQL (não incluído aqui, mas referenciado).
- **Execução**: `npm run dev` (nodemon para dev) ou `npm start`.

## 2. Dependências (backend/package.json)
```
{
  \"name\": \"backend\",
  \"version\": \"1.0.0\",
  ...
  \"dependencies\": {
    \"cors\": \"^2.8.6\",          // Permite CORS para frontend (não usado explicitamente aqui, mas disponível)
    \"dotenv\": \"^17.2.1\",       // Carrega variáveis de ambiente de .env
    \"express\": \"^5.1.0\",       // Framework web principal
    \"mysql2\": \"^3.14.3\"        // Driver MySQL com suporte a promises/pool
  },
  \"devDependencies\": {
    \"nodemon\": \"^3.1.10\",     // Reinicia servidor em dev
    \"eslint\": \"...\"           // Linter JS
  },
  \"scripts\": {
    \"start\": \"node src/server.js\",  // Produção
    \"dev\": \"nodemon src/server.js\"  // Desenvolvimento
  }
}
```
- **Por quê mysql2?** Suporte nativo a async/await e connection pooling para performance.
- **Type**: \"commonjs\" (require/module.exports, não ESM).

## 3. Banco de Dados (database/init.sql)
Executado via Docker (docker-compose.yml inicializa com este script).

```
CREATE DATABASE IF NOT EXISTS todolist;
USE todolist;

CREATE TABLE IF NOT EXISTS tasks(
    id INT AUTO_INCREMENT PRIMARY KEY,              -- ID único auto-incrementado
    title VARCHAR(255) NOT NULL,                    -- Título da tarefa (obrigatório, máx 255 chars)
    status ENUM('pendente', 'em andamento', 'concluida') DEFAULT 'pendente',  -- Status fixo, default pendente
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Data/hora de criação automática
);
```
- **Detalhes**:
  - **Chave Primária**: `id` INT AUTO_INCREMENT - Garante unicidade e eficiência em índices.
  - **title**: NOT NULL garante integridade; VARCHAR(255) é padrão para textos curtos.
  - **status**: ENUM limita valores válidos, economiza espaço vs VARCHAR; default 'pendente'.
  - **created_at**: TIMESTAMP com default CURRENT_TIMESTAMP - Registra criação automaticamente.
- **Sem índices extras**: Para app simples OK, mas em escala adicione INDEX em status/created_at.
- **Inicialização**: Docker MySQL volume monta /docker-entrypoint-initdb.d/init.sql.

## 4. Conexão com BD (backend/src/models/connection.js)
```
const mysql = require('mysql2/promise');  // Importa driver com promises
require('dotenv').config();              // Carrega .env (MYSQL_HOST, USER, etc.)

const connection = mysql.createPool({    // Pool de conexões (reutiliza, melhor performance)
    host: process.env.MYSQL_HOST,        // Ex: 'localhost' ou 'mysql' (Docker)
    user: process.env.MYSQL_USER,        // Ex: 'root'
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,      // 'todolist'
    port: process.env.MYSQL_PORT         // Ex: 3306
});

module.exports = connection;             // Exporta pool para models usarem
```
- **createPool vs createConnection**: Pool gerencia múltiplas conexões automaticamente (ideal para servidores).
- **Segurança**: Credenciais em .env (gitignore'd).
- **Uso**: Models fazem `await connection.execute(sql, params)`.

## 5. Modelo de Tarefas (backend/src/models/tasksModel.js)
Camada de acesso a dados - queries SQL puras.

```
const connection = require('./connection');  // Importa pool

const getAll = async () => {                 // Sem params (lista tudo)
    const [tasks] = await connection.execute('SELECT * FROM tasks');
    return tasks;                            // Retorna array de rows
};

const createTask = async (task) => {         // task = {title: '...'}
    const { title } = task;
    const query = 'INSERT INTO tasks(title, status) VALUES(?, ?)';
    const [result] = await connection.execute(query, [title, 'pendente']);  // Prepared stmt (anti-SQL injection)

    return {                                 // Formata resposta (não usa created_at real do BD)
        id: result.insertId,
        title,
        status: 'pendente',
        create_at: new Date().toISOString()  // Gera manual (inconsistente com BD!)
    };
};

const deleteTask = async (id) => {
    const [result] = await connection.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return result.affectedRows;              // 1 se deletou, 0 se não existia
};

const updateTask = async (id, task) => {     // task = {title?, status?}
    const {title, status} = task;
    const query = 'UPDATE tasks SET title = ?, status = ? WHERE id = ?';
    const [updatedTask] = await connection.execute(query, [title, status, id]);
    return updatedTask;                      // Não usado no controller
};

module.exports = { getAll, createTask, deleteTask, updateTask };
```
- **Segurança**: Prepared statements (?) previnem SQL injection.
- **Observações**: createTask usa new Date() em vez de BD created_at (inconsistência); updateTask ignora campos opcionais (assumindo ambos enviados).

## 6. Middlewares de Validação (backend/src/middlewares/tasksMiddleware.js)
```
const validateFieldtTitle = (req, res, next) => {  // Nota: 'FieldtTitle' tem typo (deveria ser FieldTitle)
    const {body} = req;
    if (body.title === undefined) {                // Verifica existência
        res.status(400).json({message : 'The field title is required'});
    } else if (body.title === '') {                // Verifica vazio (não trim!)
        res.status(400).json({message : 'The title cannot be empty'});
    }
    next();  // Prossegue se OK
};

const validateFieldStatus = (req, res, next) => {
    const {body} = req;
    if (body.status === undefined) {
        res.status(400).json({message : 'The field status is required'});
    } else if (body.status === '') {
        res.status(400).json({message : 'The title cannot be empty'});  // ERRO: diz 'title' em vez de 'status'!
    }
    next();
};

module.exports = { validateFieldtTitle, validateFieldStatus };
```
- **Uso**: Aplicados em POST/PUT antes do controller.
- **Limitações**: Não valida formato (ex: status só enum values), não trim(), mensagens em inglês.

## 7. Controlador de Tarefas (backend/src/controllers/tasksController.js)
Lógica HTTP + chama model.
```
const tasksModel = require('../models/tasksModel');

const getAll = async (_req, res) => {         // _req não usado
  const tasks = await tasksModel.getAll();
  return res.status(200).json(tasks);         // Array JSON
};

const createTask = async (req, res) => {
  const createdTask = await tasksModel.createTask(req.body);
  return res.status(201).json(createdTask);   // 201 Created
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const deleted = await tasksModel.deleteTask(id);
  if (deleted === 0) {
    return res.status(404).json();            // 404 vazio (melhor {error: 'Task not found'})
  }
  return res.status(204).send();              // 204 No Content
};

const updatedTask = async (req, res) => {     // Nota: nome 'updatedTask' (deveria ser updateTask?)
  const { id } = req.params;
  await tasksModel.updateTask(id, req.body);  // Não checa se updated
  return res.status(204).send();
};

module.exports = { getAll, createTask, deleteTask, updatedTask };
```
- **Padrão**: Async/await, erros propagados por status codes.

## 8. Rotas (backend/src/router.js)
```
const express = require('express');
const router = express.Router();
const tasksController = require('./controllers/tasksController');
const { validateFieldtTitle, validateFieldStatus } = require('./middlewares/tasksMiddleware');

router.get('/tasks', tasksController.getAll);                           // Sem middleware
router.post('/tasks', validateFieldtTitle, tasksController.createTask);  // Só title
router.delete('/tasks/:id', tasksController.deleteTask);
router.put('/tasks/:id', validateFieldtTitle, validateFieldStatus, tasksController.updatedTask);  // Title + status

module.exports = router;
```
- **Ordem**: Middlewares executam antes do controller (validação -> negócio).

## 9. Aplicação Express (backend/src/app.js)
```
const express = require(\"express\");
const router = require(\"./router\");

const app = express();                       // Cria instância Express
app.use(express.json());                     // Parser JSON automático (req.body)
app.use(router);                             // Monta rotas em / (prefixo root)

module.exports = app;                        // Exporta para server.js
```
- **Global**: json() popula req.body; router em todas as rotas.

## 10. Servidor Principal (backend/src/server.js)
```
const app = require('./app');                // Importa app montado
require('dotenv').config();                  // .env (PORT, DB vars)

const PORT = process.env.PORT || 3333;       // Fallback 3333
app.listen(PORT, () => console.log(`Server ruuning ${PORT}...`));  // Inicia listener; nota: 'ruuning' typo!
```
- **Entrada**: Ponto de start do npm scripts.

## 11. Fluxo de Requisições (Exemplo: POST /tasks)
1. Request chega em server.js -> app.js (express.json() -> req.body).
2. router.js -> middleware validateFieldtTitle (valida title).
3. Controller createTask -> model createTask (INSERT SQL).
4. Response 201 JSON com nova task.

**GET**: Direto ao controller/model SELECT.
**DELETE**: Checa affectedRows para 404/204.
**PUT**: Validações duplas.

## 12. Pontos de Melhoria/Observações
- **Typos**: 'FieldtTitle', 'ruuning', middleware status msg errada, 'updatedTask'.
- **Validações**: Adicione trim(), validação enum status, campos opcionais em PUT.
- **Erros**: DELETE 404 retorna {} vazio (melhor mensagem); sem try/catch global.
- **Segurança**: OK (prepared stmts), mas adicione CORS se frontend porta diferente.
- **Performance**: Pool OK; adicione cache para getAll.
- **BD**: Use created_at real no model; adicione updated_at.
- **Testes**: Sem tests (adicione Jest/Supertest).
- **Docker**: Integra com docker-compose (MySQL + backend).

Este backend é simples, funcional para CRUD tarefas. Para produção: logging (winston), autenticação (JWT), testes, Docker produção.

## 13. Integração com Frontend

O frontend (React + Vite) se conecta ao backend via **requisições HTTP fetch nativo** para a API REST em `/tasks`. Detalhes:

### Configuração da URL da API
- **Arquivo principal**: `frontend/src/App.jsx` (versão atual com hooks).
- **Constante**: `const API_URL = "";` (vazia no código - preenchida via env).
- **Env Docker**: `VITE_API_URL: http://backend:3333` (nome do serviço Docker).
- **Dev local sem Docker**: Defina `VITE_API_URL=http://localhost:3333` (porta backend).
  - Vite expõe em `http://localhost:5173`.
- **Fluxo Docker** (docker-compose.yml):
  | Serviço  | Porta Host | Internal URL     |
  |----------|------------|------------------|
  | Frontend | 5173      | localhost:5173  |
  | Backend  | ${PORT}   | backend:3333    |
  | DB       | 3307      | db:3306         |

### Chamadas HTTP no App.jsx
Todas as operações CRUD usam `fetch` com `try/catch`:

```
const fetchTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`);  // GET
  const data = await res.json();
  setTasks(data);
};

const addTask = async () => {
  await fetch(`${API_URL}/tasks`, {             // POST
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTask }),
  });
  fetchTasks();  // Refresh
};

const deleteTask = async (id) => {
  await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });  // DELETE
  fetchTasks();
};

const updateTask = async (id, title, status) => {
  await fetch(`${API_URL}/tasks/${id}`, {       // PUT
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, status }),
  });
  fetchTasks();
};
```
- **useEffect**: Carrega tasks na montagem (`fetchTasks()`).
- **Refresh**: Após mutate (POST/DELETE/PUT), chama `fetchTasks()` para atualizar UI.
- **Erros**: `console.error` simples (melhor: toast notifications).
- **Sem autenticação**: Requests públicas.

### Observações
- **CORS**: Backend tem `cors` instalado mas não usado em app.js - adicione `app.use(require('cors')())` se cross-origin.
- **API_URL vazia**: No código raw é "", falha em dev - depende de build com env.
- **Otimizações**: Use SWR/TanStack Query para cache/stale; axios para interceptors.
- **Componentes**: TaskRow recebe props deleteTask/updateTask de App.

Com Docker up, frontend acessa backend via rede interna ('backend:3333').

Fim do documento.

