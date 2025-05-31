import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import StatsCards from './components/StatsCards';
import ProgressBar from './components/ProgressBar';
import apiService from './services/apiService';

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0,
  });
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [fetchedTasks, fetchedUsers, fetchedStats] = await Promise.all([
        apiService.getTasks(),
        apiService.getUsers(),
        apiService.getStats(),
      ]);
      setTasks(fetchedTasks);
      setUsers(fetchedUsers);
      setStats(fetchedStats);
      setCompletionRate(fetchedStats.completionRate);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const createdTask = await apiService.createTask(newTask);
      setTasks(prev => [...prev, createdTask]);
      await refreshStats();
    } catch (error) {
      console.error('Add task failed:', error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const savedTask = await apiService.updateTask(updatedTask.id, updatedTask);
      setTasks(prev => prev.map(task => task.id === savedTask.id ? savedTask : task));
      await refreshStats();
    } catch (error) {
      console.error('Update task failed:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      await refreshStats();
    } catch (error) {
      console.error('Delete task failed:', error);
    }
  };

  const refreshStats = async () => {
    try {
      const fetchedStats = await apiService.getStats();
      setStats(fetchedStats);
      setCompletionRate(fetchedStats.completionRate);
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="relative mb-8">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <img 
              src="/master-motors-logo.png" 
              alt="Master Motors Logo" 
              className="h-28 w-auto"
            />
          </div>

          <h1 className="text-center text-5xl font-bold bg-gradient-to-r from-gray-800 to-red-400 bg-clip-text text-transparent p-8">
            Master Motors Task Manager
          </h1>
        </div>

        <StatsCards stats={stats} completionRate={completionRate} />
        <ProgressBar completionRate={completionRate} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TaskForm 
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              users={users}
            />
          </div>

          <div className="lg:col-span-2">
            <TaskList 
              tasks={tasks}
              users={users}
              filter={filter}
              onFilterChange={setFilter}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
