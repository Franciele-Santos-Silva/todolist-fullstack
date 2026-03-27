// src/models/tasksModel.js
const connection = require("./connection");

const getAll = async () => {
  const [tasks] = await connection.execute("SELECT * FROM tasks");
  return tasks;
};

const createTask = async (task) => {
  // Mapear campos do frontend para DB
  const {
    title,
    descricao = null,
    concluida = false,
    lista = "Pessoal",
    data_vencimento = null,
    etiquetas = [],
    subtarefas = [],
  } = task;

  const status = concluida ? "concluida" : "pendente";

  const query = `
    INSERT INTO tasks 
      (title, descricao, status, lista, data_vencimento, etiquetas, subtarefas) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    title,
    descricao,
    status,
    lista,
    data_vencimento,
    JSON.stringify(etiquetas),
    JSON.stringify(subtarefas),
  ];

  const [result] = await connection.execute(query, values);

  // Retornar a tarefa criada
  const [createdTasks] = await connection.execute(
    "SELECT * FROM tasks WHERE id = ?",
    [result.insertId],
  );
  return createdTasks[0];
};

const deleteTask = async (id) => {
  const [result] = await connection.execute("DELETE FROM tasks WHERE id = ?", [
    id,
  ]);
  return result.affectedRows;
};

const updateTask = async (id, task) => {
  const {
    title,
    titulo,
    descricao,
    concluida,
    lista,
    data_vencimento,
    dataVencimento,
    etiquetas,
    subtarefas,
  } = task;

  if (titulo !== undefined) {
    task.title = titulo;
  }
  if (dataVencimento !== undefined) {
    task.data_vencimento = dataVencimento;
  }

  const status =
    concluida !== undefined
      ? concluida
        ? "concluida"
        : "pendente"
      : undefined;

  let setClause = "updated_at = CURRENT_TIMESTAMP";
  const values = [id];

  if (title !== undefined) {
    setClause += ", title = ?";
    values.unshift(title);
  }
  if (descricao !== undefined) {
    setClause += ", descricao = ?";
    values.unshift(descricao || null);
  }
  if (status !== undefined) {
    setClause += ", status = ?";
    values.unshift(status);
  }
  if (concluida !== undefined) {
    const newStatus = concluida ? "concluida" : "pendente";
    setClause += ", status = ?";
    values.unshift(newStatus);
  }
  if (lista !== undefined) {
    setClause += ", lista = ?";
    values.unshift(lista);
  }
  if (data_vencimento !== undefined) {
    setClause += ", data_vencimento = ?";
    values.unshift(data_vencimento);
  }
  if (etiquetas !== undefined) {
    setClause += ", etiquetas = ?";
    values.unshift(JSON.stringify(etiquetas));
  }
  if (subtarefas !== undefined) {
    setClause += ", subtarefas = ?";
    values.unshift(JSON.stringify(subtarefas));
  }

  const query = `UPDATE tasks SET ${setClause} WHERE id = ?`;
  const [result] = await connection.execute(query, values);

  if (result.affectedRows === 0) {
    throw new Error("Task not found");
  }

  const [updatedTasks] = await connection.execute(
    "SELECT * FROM tasks WHERE id = ?",
    [id],
  );
  return updatedTasks[0];
};

module.exports = {
  getAll,
  createTask,
  deleteTask,
  updateTask,
};
