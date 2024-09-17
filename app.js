const express = require('express')
const bodyParser = require("body-parser")
const fs = require('fs')
const app = express()
const PORT = 3000
const path = require('path')

//Middleware
app.use(bodyParser.urlencoded({extended: true}));
//urlencoded : talks about package infiormation and how its formatted
app.use(express.static('public'));
app.set('view engine', 'ejs');

//load tasks from the JSON file
const getTasks = () => {
    const data = fs.readFileSync('./data/tasks.json', 'utf8');
    return JSON.parse(data);
};

const saveTasks = (tasks) => {
    fs.writeFileSync('./data/tasks.json', JSON.stringify(tasks, null, 2));
};

//routes

//Get: show all tasks
app.get('/', (req, res) => {
    const tasks = getTasks();
    res.render('index', { tasks });
});

//post: create new task
app.post('/tasks', (req, res) => {
    const tasks = getTasks();
    const newTask = {
        id: tasks.length+1,
        name: req.body.name,
        date: req.body.date,
        description: req.body.description
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.redirect('/');
});

//get: show a single task for editing
app.get('/tasks/:id/edit', (req, res) => {
    const tasks = getTasks();
    const task = tasks.find(task => task.id == req.params.id)
    res.render('tasks', { task });
});

//put: update a task
app.post('/tasks/:id', (req,res) => {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id == req.params.id)//finding the right item
    tasks[taskIndex].type = req.body.type; //redefine the task data
    tasks[taskIndex].name = req.body.name; //redefine the task data
    tasks[taskIndex].date = req.body.date; 
    saveTasks(tasks)
    res.redirect('/');
});

//deletee
app.post('/tasks/:id/delete',(req,res) => {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id != req.params.id);
    saveTasks(tasks);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});


