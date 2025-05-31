Master Motors Task Manager
This is a task management application built with React,Express and Tailwind CSS. It allows users to create, assign, update, and delete tasks, track their progress, and view visual statistics through a dashboard and progress bar.

Features
Users can manage tasks by setting their status as "To Do", "In Progress", or "Completed". Each task can be assigned a priority, a due date, and a specific user. The interface highlights overdue or upcoming tasks and displays key statistics, including completion rate.

Technologies Used
The frontend is built with React and styled using Tailwind CSS. API interactions are handled using the native fetch method. Backend is designed using Express.js a framework of node.js and the application connects to a backend REST API running locally. Json file is used as a Database .

Installation Instructions:
Requirements
Node.js and npm installed on your system


If any error occurs then only run these command else start from Running Commands
- npm install express sqlite3 cors dotenv fs
- npm install --save-dev nodemon
- npm install -D tailwindcss postcss autoprefixer
- npx tailwindcss init -p

Commands to run:
open two terminal and navigate to each folder i;e backend and frontend
- in terminal where you have navigatedd to backend folder run "npm run dev" // available at http://localhost:5000/
- in terminal where you have navigatedd to frontend folder run "npm start" // available at http://localhost:3000/

Application Workflow
On launch, the app fetches tasks, users, and stats from the backend (from tasks.json file inside data folder). Users can create tasks via the form, and update or delete them from the task list. Filtering is available based on task status. Stats and progress are updated automatically as tasks change.