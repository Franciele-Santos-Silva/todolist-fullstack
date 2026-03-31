# TodoList Fullstack

Este é um aplicativo Todo List fullstack construído com tecnologias web modernas:

**Frontend**: React + Vite + Tailwind CSS (inferido da estrutura de componentes)
**Backend**: Node.js + Express.js
**Banco de Dados**: MySQL/PostgreSQL (via init.sql e models)
**Containerização**: Docker + Docker Compose
**Deploy**: Pronto para desenvolvimento local e deployment containerizado

Principais funcionalidades:
- Criar, ler, atualizar, deletar (CRUD) tarefas
- Listagem de tarefas e visualização de detalhes
- Navegação por sidebar
- Interface responsiva

## Pré-requisitos

- Node.js (v18+)
- Docker & Docker Compose
- Yarn ou npm
- Cliente MySQL (opcional, para DB local)

## Início Rápido (Docker - Recomendado)

1. Clone o repositório (se ainda não fez):
   ```bash
   git clone <repo-url>
   cd todolist-fullstack
   ```

2. Inicie a stack:
   ```bash
   docker-compose up --build
   ```

3. Abra no navegador: [http://localhost:5173](http://localhost:5173) (ou porta especificada no docker-compose.yml)

4. Pare: `docker-compose down`

## Desenvolvimento Local

### Backend
```bash
cd backend
npm install
npm run dev 
```

### Banco de Dados
- Usa DB dockerizado (veja docker-compose.yml)
- Ou manualmente: Execute `database/init.sql` na sua instância MySQL/PostgreSQL

### Frontend
```bash
cd frontend
npm install
npm run dev
```

**Proxy**: Chamadas API do frontend proxy para backend (ver vite.config.js).

## Endpoints da API

URL Base: `http://localhost:3000/api` (backend)

| Método | Endpoint       | Descrição              |
|--------|----------------|------------------------|
| GET    | /tasks         | Listar todas tarefas   |
| POST   | /tasks         | Criar tarefa           |
| GET    | /tasks/:id     | Detalhes da tarefa     |
| PUT    | /tasks/:id     | Atualizar tarefa       |
| DELETE | /tasks/:id     | Deletar tarefa         |

Veja `backend/src/controllers/tasksController.js` para detalhes.

## Scripts

**Backend** (`backend/package.json`):
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Servidor de produção

**Frontend** (`frontend/package.json`):
- `npm run dev` - Servidor Vite dev
- `npm run build` - Build de produção
- `npm run preview` - Preview do build de produção

## Comandos Docker

```bash

docker-compose up --build

# Rodar em background
docker-compose up -d

# Logs
docker-compose logs -f

# Rebuild
docker-compose down && docker-compose up --build
```
