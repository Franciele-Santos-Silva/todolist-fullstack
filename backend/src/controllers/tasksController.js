// const tasksModel = require('../models/tasksModel');

// const getAll = async (_req, res) => {
//   const tasks = await tasksModel.getAll();
//   return res.status(200).json(tasks);
// };

// const createTask = async (req, res) => {
//   const createdTask = await tasksModel.createTask(req.body);

//   return res.status(201).json(createdTask); 
// };

// const deleteTask = async (req, res) => {
//   const {id} = req.params;

//   await tasksModel.deleteTask(id);
//   return res.status(204).json();
// };

// module.exports = {
//   getAll,
//   createTask,
//   deleteTask,
// };

const tasksModel = require('../models/tasksModel');

const getAll = async (_req, res) => {
  const tasks = await tasksModel.getAll();
  return res.status(200).json(tasks);
};

const createTask = async (req, res) => {
  const createdTask = await tasksModel.createTask(req.body);
  return res.status(201).json(createdTask); 
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  const deleted = await tasksModel.deleteTask(id);

  if (deleted === 0) {
    return res.status(404).json({ message: 'Task not found' });
  }

  return res.status(204).send(); 
};

module.exports = {
  getAll,
  createTask,
  deleteTask,
};

