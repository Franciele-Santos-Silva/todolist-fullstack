# 🚀 TodoList Fullstack

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com) [![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev) [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org) [![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)

## 📋 Visão Geral

**TodoList Fullstack** é um projeto completo e containerizado para gerenciamento de tarefas com operações CRUD, validações e interface intuitiva.

**Arquitetura:**
- **Frontend**: React + Vite (SPA moderna)
- **Backend**: Node.js/Express (API REST)
- **Banco**: MySQL (containerizado)
- **Infra**: Docker + Docker Compose

[![Arquitetura](https://via.placeholder.com/800x200/0f0f0f/ffffff?text=TodoList+Fullstack+Architecture)](https://github.com/)

## 🛠️ Stack Tecnológico

### Backend
```json
{
  "express": "^5.1.0",
  "mysql2": "^3.14.3", 
  "dotenv": "^17.2.1",
  "nodemon": "^3.1.10"
}
```

### Frontend  
```json
{
  "react": "^18.0.0",
  "vite": "^latest",
  "axios": "^latest"
}
```

### Infra
- Docker, Docker Compose
- MySQL 8+

## 📁 Estrutura de Arquivos

```
todolist-fullstack/
├── backend/                 # API Node.js/Express (porta 3333)
│   ├── src/
│   │   ├── server.js      # Server entrypoint
│   │   ├── app.js         # Express config
│   │   ├── router.js      # API routes
│   │   ├── controllers/tasksController.js
│   │   ├── middlewares/tasksMiddleware.js
│   │   └── models/
│   │       ├── connection.js  # MySQL pool
│   │       └── tasksModel.js
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React/Vite SPA (porta 5173)
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js         # HTTP client
│   │   ├── contexts/TaskContext.js
│   │   ├── hooks/useTasks.js
│   │   ├── components/
│   │   │   ├── Sidebar.js
│   │   │   ├── TaskList.js
│   │   │   ├── TaskItem.js
│   │   │   └── TaskDetail.js
│   │   └── utils/taskUtils.js
│   ├── Dockerfile
│   └── vite.config.js
├── database/
│   └── init.sql          # Schema tasks
├── docker-compose.yml    # Orquestra tudo
└── README.md             # 👈 Você está aqui!
```

## ✨ Funcionalidades

<details>
<summary>🔹 Backend API (localhost:3333)</summary>

| Método | Endpoint     | Descrição | Body Example |
|--------|--------------|-----------|--------------|
| `GET`  | `/tasks`     | Listar tarefas | - |
| `POST` | `/tasks`     | Criar tarefa | `{"title": "Nova tarefa"}` |
| `PUT`  | `/tasks/:id` | Atualizar | `{"title": "...", "status": "concluída"}` |
| `DELETE` | `/tasks/:id` | Deletar | - |

**Status:** `pendente` | `em andamento` | `concluída`

**Validações:** Title obrigatório, status válido.

**Teste rápido:**
```bash
curl -X POST http://localhost:3333/tasks -H "Content-Type: application/json" -d '{"title":"Teste"}'
```

</details>

<details>
<summary>🎨 Frontend Features</summary>

- ✅ CRUD completo de tarefas
- ✅ Filtros por status
- ✅ Detalhes de tarefa
- ✅ Sidebar navegação
- ✅ Context API + custom hooks
- ✅ Design responsivo

</details>

## ⚙️ Setup Rápido

### 🐳 Docker (Recomendado)

1. **Copie .env (backend):**
   ```bash
   cp backend/.env.example backend/.env
   # Edite MYSQL_PASSWORD=root (padrão)
   ```

2. **Execute:**
   ```bash
   docker-compose up --build -d
   ```

3. **Acesse:**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **API:** [http://localhost:3333/tasks](http://localhost:3333/tasks)
   - **DB:** `mysql -h localhost -P 3306 -u root -proot todolist`

### 💻 Local (sem Docker)

```bash
# Backend
cd backend && npm i && npm run dev

# Frontend (novo terminal)
cd frontend && npm i && npm run dev
```

**Dica:** Configure `VITE_API_URL=http://localhost:3333` no frontend.

## 🗄️ Banco de Dados

**Schema** (`database/init.sql`):
```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🐳 Docker Compose Services

```yaml
services:
  frontend:  # Vite dev server (5173)
  backend:   # Node.js API (3333)  
  mysql:     # Banco (3306)
```

## ✅ Status do Projeto

| Componente | Status |
|------------|--------|
| Docker | ✅ Completo |
| API CRUD | ✅ Testada |
| Frontend | ✅ Conectado |
| Validações | ✅ Implementadas |
| Documentação | ✅ Otimizada |

## 🚀 Próximas Melhorias

- [ ] Autenticação JWT
- [ ] Paginação + Busca
- [ ] Upload anexos
- [ ] WebSockets (notificações)
- [ ] Testes (Jest/Cypress)
- [ ] CI/CD (GitHub Actions)
- [ ] Deploy (Railway/Vercel)

---

**👨‍💻 Desenvolvido com ❤️ | [Contribua!](https://github.com/)**  
**📅 Última atualização:** Automatizada via BLACKBOXAI

