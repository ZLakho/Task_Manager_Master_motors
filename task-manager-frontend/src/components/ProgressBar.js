import React from 'react';

function ProgressBar({ completionRate }) {
  return (
    <div className="bg-orange-50 rounded-xl shadow-sm border border-red-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
        <span className="text-sm font-medium text-black">{completionRate}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-red-500 to-gray-700 h-3 rounded-full transition-all duration-1000"
          style={{ width: `${completionRate}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;