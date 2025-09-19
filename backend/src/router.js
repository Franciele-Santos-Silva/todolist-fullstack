const express = require('express');
const tasksController = require('./controllers/tasksController');
const { validateBody } = require('./middlewares/tasksMiddleware');

const router = express.Router();

router.get('/tasks', tasksController.getAll);
router.post('/tasks', validateBody, tasksController.createTask);
router.delete('/tasks/:id', tasksController.deleteTask);
router.delete('/tasks/:id', tasksController.deleteTask);
router.put('/tasks/:id', validateBody, tasksController.updatedTask);

module.exports = router;
