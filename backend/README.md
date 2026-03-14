# Backend Documentation - TodoList API

## Overview
Esta é a API REST do TodoList desenvolvida em Node.js com Express.js e MySQL. Implementa operações CRUD completas para gerenciamento de tarefas com validação de entrada.

**Tech Stack:**
- Express.js (^5.1.0) - Framework web
- MySQL2 (^3.14.3) - Driver MySQL
- dotenv (^17.2.1) - Variáveis de ambiente
- nodemon (^3.1.10) - Hot reload em desenvolvimento

## Estrutura de Arquivos
```
backend/
├── src/
│   ├── server.js          # Ponto de entrada do servidor (porta 3333)
│   ├── app.js             # Configuração Express + middlewares
│   ├── router.js          # Definição das rotas da API
│   ├── controllers/
│   │   └── tasksController.js  # Lógica de negócio
│   ├── middlewares/
│   │   └── tasksMiddleware.js  # Validação de entrada
│   └── models/
│       ├── connection.js     # Pool de conexão MySQL
│       └── tasksModel.js     # Queries SQL
├── package.json
├── .env                    # (criar) Credenciais do banco
└── Dockerfile
```

## Setup / Instalação
1. `cd backend`
2. `npm install`
3. **Crie o arquivo `.env`:**
   ```
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=suasenha
   MYSQL_DB=todolist
   MYSQL_PORT=3306
   PORT=3333
   ```
4. **Crie o banco e tabela (MySQL):**
   ```sql
   CREATE DATABASE todolist;
   USE todolist;
   CREATE TABLE tasks (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     status VARCHAR(50) DEFAULT 'pendente',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Endpoints da API
| Método | Endpoint       | Descrição                   | Body da Requisição             | Resposta                   |
|--------|----------------|-----------------------------|--------------------------------|----------------------------|
| **GET** | `/tasks`      | Listar todas tarefas        | -                              | 200: `[{id, title, status, created_at}]` |
| **POST**| `/tasks`      | Criar nova tarefa           | `{title: \"string\"}`          | 201: `{id, title, status, create_at}` |
| **PUT** | `/tasks/:id`  | Atualizar tarefa            | `{title: \"string\", status: \"string\"}` | 204: No content        |
| **DELETE** | `/tasks/:id` | Excluir tarefa            | -                              | 204 (sucesso), 404 (não encontrada) |

**Valores de status:** `pendente`, `em andamento`, `concluida`

**Validações:**
- `title`: obrigatório e não pode ser vazio (POST/PUT)
- `status`: obrigatório no PUT

## Fluxo de Funcionamento
```
Cliente → router.js (rotas + middleware) → controller.js (lógica) → model.js (SQL) → MySQL
```

1. **server.js**: Carrega app.js e inicia servidor na PORT
2. **app.js**: Configura `express.json()` e monta router
3. **router.js**: Define rotas chamando controller + middlewares
4. **tasksController.js**: Chama model e responde HTTP status/JSON
5. **tasksMiddleware.js**: Valida `req.body.title` e `status`
6. **models/connection.js**: Pool MySQL2 com variáveis .env
7. **tasksModel.js**: Queries SQL raw (SELECT/INSERT/UPDATE/DELETE)

## Como Executar
```bash
npm run dev    # nodemon src/server.js (desenvolvimento)
# ou
npm start      # node src/server.js (produção)
```

**Teste a API:**
```bash
curl http://localhost:3333/tasks

curl -X POST http://localhost:3333/tasks \\
  -H \"Content-Type: application/json\" \\
  -d '{\"title\":\"Minha tarefa\"}'
```

## Docker
```bash
# Build
docker build -t todolist-backend .

# Run com docker-compose (inclui MySQL)
cd .. && docker-compose up -d
```

## Possíveis Melhorias
- ✅ Validação de entrada (middleware)
- ✅ Pool de conexão MySQL
- 🔄 Adicionar autenticação JWT
- 🔄 Pagination nas tarefas
- 🔄 Logs estruturados (Winston)
- 🔄 Testes unitários (Jest)
- 🔄 Rate limiting
- 🔄 CORS para frontend

---
*TodoList Backend API - Gerenciamento completo de tarefas*
