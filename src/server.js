const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('basic-auth');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Task storage
let tasks = [];
const TASKS_FILE = path.join(__dirname, 'tasks.txt');

// Load tasks from file
function loadTasks() {
    try {
        if (fs.existsSync(TASKS_FILE)) {
            const data = fs.readFileSync(TASKS_FILE, 'utf8');
            tasks = JSON.parse(data);
            console.log(`Loaded ${tasks.length} tasks`);
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = [];
    }
}

// Save tasks to file
function saveTasks() {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
        console.log('Tasks saved successfully');
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

// Basic authentication middleware
function authenticate(req, res, next) {
    const credentials = auth(req);
    if (!credentials || credentials.name !== 'user' || credentials.pass !== 'pass') {
        res.set('WWW-Authenticate', 'Basic realm="To-Do API"');
        return res.status(401).send('Unauthorized');
    }
    next();
}

// Load tasks on startup
loadTasks();

// Routes
app.get('/tasks', authenticate, (req, res) => {
    res.json({ tasks });
});

app.post('/tasks', authenticate, (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    const newTask = {
        id: tasks.length + 1,
        description,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    res.status(201).json(newTask);
});

app.put('/tasks/:id', authenticate, (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    task.completed = true;
    saveTasks();
    res.json(task);
});

app.delete('/tasks/:id', authenticate, (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    saveTasks();
    res.json({ message: `Task ${taskId} deleted` });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 