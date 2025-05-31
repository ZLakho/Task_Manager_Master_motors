import React from 'react';
import { Users, CheckCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

function StatsCards({ stats, completionRate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <div className="bg-orange-50 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black">Total Tasks</p>
            <p className="text-2xl font-bold text-black">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-orange-50 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black">Completed</p>
            <p className="text-2xl font-bold text-black">{stats.completed}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-orange-50 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black">In Progress</p>
            <p className="text-2xl font-bold text-black">{stats.inProgress}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-orange-50 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdue || 0}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-800" />
          </div>
        </div>
      </div>

      <div className="bg-orange-50 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black">Completion Rate</p>
            <p className="text-2xl font-bold text-black">{completionRate}%</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;