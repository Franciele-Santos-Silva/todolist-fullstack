const express = require('express');
const router = express.Router();

const tasksController = require('./controllers/tasksController');
const { validateFieldtTitle, validateFieldStatus } = require('./middlewares/tasksMiddleware');

router.get('/tasks', tasksController.getAll);
router.post('/tasks',  validateFieldtTitle, tasksController.createTask);
router.delete('/tasks/:id', tasksController.deleteTask);
router.put('/tasks/:id', validateFieldtTitle, validateFieldStatus, tasksController.updatedTask);

module.exports = router;

