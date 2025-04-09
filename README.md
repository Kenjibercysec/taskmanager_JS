# TaskMaster Pro - Node.js Version

This is a task management application with a Node.js backend, designed to be deployed on Vercel.

## Features

- Create, read, update, and delete tasks
- Basic authentication
- Persistent storage using file system
- CORS enabled
- Modern UI with responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. For production:
```bash
npm start
```

## Deployment on Vercel

1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Vercel will automatically detect the Node.js configuration and deploy the application

## Authentication

The API uses Basic Authentication:
- Username: user
- Password: pass

## API Endpoints

- GET /tasks - Get all tasks
- POST /tasks - Create a new task
- PUT /tasks/:id - Mark a task as completed
- DELETE /tasks/:id - Delete a task

## Environment Variables

- PORT: Server port (default: 8080) 