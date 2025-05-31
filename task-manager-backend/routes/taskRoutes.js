const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/tasks.json');

function getTasks() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

router.get('/', (req, res) => {
  const tasks = getTasks();
  res.json(tasks);
});

router.post('/', (req, res) => {
  const tasks = getTasks();
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

router.put('/:id', (req, res) => {
  let tasks = getTasks();
  const taskIndex = tasks.findIndex(t => t.id == req.params.id);
  if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  saveTasks(tasks);
  res.json(tasks[taskIndex]);
});

router.delete('/:id', (req, res) => {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.id != req.params.id);
  saveTasks(tasks);
  res.json({ message: "Task deleted" });
});

module.exports = router;
