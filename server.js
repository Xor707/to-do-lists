const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
const PORT = 2000;

app.use(bodyParser.json());

// Load initial tasks from JSON file
let tasks = require('./tasks.json');

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// CRUD operations

// Create (C) - Add Task
app.post('/tasks', (req, res) => {
  const newTask = req.body;
  newTask.id = tasks.length + 1;
  tasks.push(newTask);
  saveTasksToJsonFile();
  res.status(201).json(newTask);
});

// Read (R) - Get All Tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Read (R) - Get Task by ID
app.get('/tasks/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
  } else {
    res.json(task);
  }
});

// Update (U) - Update Task
app.put('/tasks/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const updatedTask = req.body;
  const index = tasks.findIndex(t => t.id === taskId);

  if (index === -1) {
    res.status(404).json({ error: 'Task not found' });
  } else {
    tasks[index] = { ...tasks[index], ...updatedTask };
    saveTasksToJsonFile();
    res.json(tasks[index]);
  }
});

// Delete (D) - Delete Task
app.delete('/tasks/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId);
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasksToJsonFile();
  res.status(204).send();
});

// Save tasks to JSON file
async function saveTasksToJsonFile() {
  await fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2));
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
