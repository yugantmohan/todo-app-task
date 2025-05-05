# TodoVault

A full-stack Todo management application with user authentication, task tracking, drag-and-drop reordering, filtering, search, pagination, and activity logging.

## To Check Deployment:

- App(frontend/backend): https://todo-app-task-production.up.railway.app/

## Features

- User Signup & Login (JWT-based)
- Create, Read, Update, Delete Todos
- Drag-and-drop reordering (Dnd-kit)
- Search, Filter (by status), and Pagination
- Due date & Overdue highlighting
- Activity logging
- Secure endpoints with authentication

## Tech Stack

**Frontend:**

- React + TypeScript
- Vite
- Tailwind CSS
- Dnd Kit

**Backend:**

- Express + TypeScript
- MongoDB + Mongoose
- JWT for authentication

## Setup Instructions

### 1. Clone the repository

bash
git clone https://github.com/yugantmohan/todo-app.git
cd todo-app

### 2. Environment Variables

Create .env files in both todo-backend and todo-frontend.

Backend (todo-backend/.env):

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000

Frontend (todo-frontend/.env):

VITE_API_URL=http://localhost:3000/api

### 3. Run locally

Backend:

cd todo-backend
npm install
npm run dev

Frontend:

cd todo-frontend
npm install
npm run dev

API Routes

Auth
POST /api/auth/signup — Register

POST /api/auth/login — Login

Todos
GET /api/todos — Get todos (with search, filter, pagination)

POST /api/todos — Create todo

PUT /api/todos/:id — Update todo

DELETE /api/todos/:id — Delete todo

PATCH /api/todos/reorder — Reorder todos

License
MIT
