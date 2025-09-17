const express = require('express');
const tasksController = require('./controllers/tasksController');

const router = express.Router();

const tasksController = require('./controllers/tasksController');
const taskMiddleware = require('./middlewares/taskMiddleware');

router.get('/tasks', tasksController.getAll);
router.post('/tasks', taskMiddleware.validateBody, tasksController.createTask);

module.exports = router;