import React, { useState } from 'react';
import { Edit3, Trash2, CheckCircle, Clock, AlertCircle, Filter, Calendar, User, AlertTriangle } from 'lucide-react';

function TaskList({ tasks, users = [], filter, onFilterChange, onUpdateTask, onDeleteTask }) {
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ 
    title: '', 
    description: '', 
    status: 'To Do', 
    priority: 'Medium',
    assignedTo: '',
    dueDate: ''
  });

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 'Completed':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
      case 'In Progress':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock };
      case 'To Do':
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle };
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'Completed') return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  const getDueDateStatus = (dueDate, status) => {
    if (!dueDate) return null;
    
    if (status === 'Completed') return 'completed';
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays <= 3) return 'upcoming';
    return 'normal';
  };

  const getDueDateColor = (dueDate, status) => {
    const dueDateStatus = getDueDateStatus(dueDate, status);
    switch(dueDateStatus) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'today': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task.id);
    setEditForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo || '',
      dueDate: task.dueDate || ''
    });
  };

  const saveEdit = (task) => {
    const updatedTask = { ...task, ...editForm };
    onUpdateTask(updatedTask);
    setEditingTask(null);
    setEditForm({ 
      title: '', 
      description: '', 
      status: 'To Do', 
      priority: 'Medium',
      assignedTo: '',
      dueDate: ''
    });
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditForm({ 
      title: '', 
      description: '', 
      status: 'To Do', 
      priority: 'Medium',
      assignedTo: '',
      dueDate: ''
    });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="bg-orange-50 rounded-xl shadow-sm border border-red-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-3 py-1 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-200 focus:border-transparent"
          >
            <option value="All">All Tasks</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const StatusIcon = getStatusInfo(task.status).icon;
            const isEditing = editingTask === task.id;
            const taskOverdue = isOverdue(task.dueDate, task.status);
            
            return (
              <div
                key={task.id}
                className={`group border rounded-lg p-4 hover:shadow-md transition-all duration-500 ${
                  taskOverdue ? 'border-red-500 bg-red-50' : 'border-red-400 hover:border-red-700'
                }`}
              >
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          name="priority"
                          value={editForm.priority}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <User className="w-4 h-4 inline mr-1" />
                          Assign To
                        </label>
                        <select
                          name="assignedTo"
                          value={editForm.assignedTo}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Select User</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.role})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Due Date
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          value={editForm.dueDate}
                          onChange={handleChange}
                          min={getTodayDate()}
                          className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(task)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 border border-red-200 text-gray-700 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className="w-5 h-5 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        {taskOverdue && (
                          <AlertTriangle className="w-5 h-5 text-red-500" title="Overdue" />
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 mb-3 ml-8">{task.description}</p>
                      )}
                      
                      <div className="flex items-center gap-3 ml-8 flex-wrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusInfo(task.status).color}`}>
                          {task.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        
                        {task.assignedTo && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium border bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {getUserName(task.assignedTo)}
                          </span>
                        )}
                        
                        {task.dueDate && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getDueDateColor(task.dueDate, task.status)}`}>
                            <Calendar className="w-3 h-3" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        
                        <span className="text-xs text-gray-500">
                          Created: {task.createdAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TaskList;