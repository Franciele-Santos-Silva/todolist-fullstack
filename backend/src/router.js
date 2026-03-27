const express = require("express");
const router = express.Router();

const tasksController = require("./controllers/tasksController");
const {
  validateFieldTitle,
  validateFieldStatus,
} = require("./middlewares/tasksMiddleware");

// REMOVA /tasks daqui
router.get("/", tasksController.getAll);
router.post("/", validateFieldTitle, tasksController.createTask);
router.delete("/:id", tasksController.deleteTask);
router.put(
  "/:id",
  validateFieldTitle,
  validateFieldStatus,
  tasksController.updateTask,
);

module.exports = router;
