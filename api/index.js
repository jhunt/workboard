const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const DB = require("./data");


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/w', (req, res) => {
  res.json({
    title: process.env.BOARD_TITLE ? process.env.BOARD_TITLE : 'Untitled Workboard'
  });
});

app.get('/w/tasks', (req, res) => {
  const db = new DB();
  db.getTasks()
    .then(tasks => res.json({tasks}));
});

app.post('/w/tasks', (req, res) => {
  const db = new DB();
  db.createTask(req.body)
    .then(task => res.json({task}));
});

app.get('/w/task/:id', (req, res) => {
  const db = new DB();
  db.getTask(req.params.id)
    .then(task => res.json({task: JSON.parse(task)}));
});

app.put('/w/task/:id', (req, res) => {
  const db = new DB();
  const task = req.body;
  task.id = req.params.id;

  db.updateTask(task)
    .then(() => db.getTask(task.id))
    .then(task => res.json({task: JSON.parse(task)}));
});

app.delete('/w/task/:id', (req, res) => {
  const db = new DB();

  db.deleteTask(req.params.id)
    .then(() => res.status(204).send());
});

app.post('/w/task/:id/log', (req, res) => {
  const db = new DB();
  db.log(req.params.id, req.body)
    .then(() => res.json({ok: "logged"}));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
