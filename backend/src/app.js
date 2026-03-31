const express = require("express");
const cors = require("cors");
const taskRoutes = require("./router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);

module.exports = app;
