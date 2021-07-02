const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const controller = require("./controller");


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/w', (req, res) => {
  res.json({
    title: process.env.BOARD_TITLE ? process.env.BOARD_TITLE : 'Untitled Workboard'
  });
});

app.get('/w/contexts', (req, res) => {
  controller.getAllContexts(req, res);
});

app.get('/w/tasks', (req, res) => {
  controller.getAllTasks(null, req, res);
});
app.get('/w/_/:context/tasks', (req, res) => {
  controller.getAllTasks(req.params.context, req, res);
});

app.post('/w/tasks', (req, res) => {
  controller.createTask(null, req, res);
});
app.post('/w/_/:context/tasks', (req, res) => {
  controller.createTask(req.params.context, req, res);
});

app.get('/w/task/:id', (req, res) => {
  controller.getTask(null, req, res);
});
app.get('/w/_/:context/task/:id', (req, res) => {
  controller.getTask(req.params.context, req, res);
});

app.put('/w/task/:id', (req, res) => {
  controller.updateTask(null, req, res);
});
app.put('/w/_/:context/task/:id', (req, res) => {
  controller.updateTask(req.params.context, req, res);
});

app.delete('/w/task/:id', (req, res) => {
  controller.deleteTask(null, req, res);
});
app.delete('/w/_/:context/task/:id', (req, res) => {
  controller.deleteTask(req.params.context, req, res);
});

app.post('/w/task/:id/log', (req, res) => {
  controller.appendLogEntry(null, req, res);
});
app.post('/w/_/:context/task/:id/log', (req, res) => {
  controller.appendLogEntry(req.params.context, req, res);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
