const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

const readTasks = () => {
  try {
    if (!fs.existsSync(tasksFilePath)) {
      const defaultTasks = [
        { 
          id: 1, 
          title: 'Design System Update', 
          description: 'Update the design system components for better consistency', 
          status: 'In Progress', 
          priority: 'High', 
          assignedTo: 'john_doe',
          dueDate: '2024-06-15',
          createdAt: '2024-05-28' 
        },
        { 
          id: 2, 
          title: 'API Documentation', 
          description: 'Write comprehensive API documentation for new endpoints', 
          status: 'To Do', 
          priority: 'Medium', 
          assignedTo: 'jane_smith',
          dueDate: '2024-06-10',
          createdAt: '2024-05-29' 
        },
        { 
          id: 3, 
          title: 'Bug Fix - Login Issue', 
          description: 'Fix the authentication bug reported by users', 
          status: 'Completed', 
          priority: 'High', 
          assignedTo: 'mike_wilson',
          dueDate: '2024-06-01',
          createdAt: '2024-05-27' 
        }
      ];
      
      const dataDir = path.dirname(tasksFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(tasksFilePath, JSON.stringify(defaultTasks, null, 2));
      return defaultTasks;
    }
    
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
  }
};

const writeTasks = (tasks) => {
  try {
    const dataDir = path.dirname(tasksFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing tasks:', error);
    return false;
  }
};

const users = [
  { id: 'Javeria_Altaf', name: 'Javeria Altaf', role: 'Developer' },
  { id: 'Tasbiha_Malik', name: 'Tasbiha Malik', role: 'Designer' },
  { id: 'Abdul_Ayub_Khan', name: 'Abdul Ayub Khan', role: 'QA Engineer' },
  { id: 'Zainab_Lakho', name: 'Zainab Lakho', role: 'Project Manager' },
  { id: 'Muhammad_Huzaifa', name: 'Muhammad Huzaifa', role: 'Backend Developer' }
];

app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  tasks.push(newTask);
  
  if (writeTasks(tasks)) {
    res.status(201).json(newTask);
  } else {
    res.status(500).json({ error: 'Failed to save task' });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  
  if (writeTasks(tasks)) {
    res.json(tasks[taskIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  
  if (filteredTasks.length === tasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (writeTasks(filteredTasks)) {
    res.json({ message: 'Task deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.get('/api/stats', (req, res) => {
  const tasks = readTasks();
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    todo: tasks.filter(t => t.status === 'To Do').length,
    overdue: tasks.filter(t => {
      const today = new Date().toISOString().split('T')[0];
      return t.dueDate && t.dueDate < today && t.status !== 'Completed';
    }).length
  };
  
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  res.json({ ...stats, completionRate });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Tasks file path: ${tasksFilePath}`);
});