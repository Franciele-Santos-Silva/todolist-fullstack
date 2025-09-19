// const express = require('express');
// const tasksController = require('./controllers/tasksController');
// const { validateBody } = require('./middlewares/tasksMiddleware');

// const router = express.Router();

// router.get('/tasks', tasksController.getAll);
// router.post('/tasks', validateBody, tasksController.createTask);
// router.delete('/tasks/:id', tasksController.deleteTask);

// module.exports = router;

const express = require('express');
const tasksController = require('./controllers/tasksController');
const { validateBody } = require('./middlewares/tasksMiddleware');

const router = express.Router();

router.get('/tasks', tasksController.getAll);
router.post('/tasks', validateBody, tasksController.createTask);
router.delete('/tasks/:id', tasksController.deleteTask);

module.exports = router;
