const DB = require("./data");

module.exports = {
  getAllContexts(req, res) {
    const db = new DB()
    db.getContexts()
      .then(contexts => res.json(contexts));
  },

  getAllTasks(c, req, res) {
    const db = new DB(c);
    db.getTasks()
      .then(tasks => res.json({tasks}));
  },

  createTask(c, req, res) {
    const db = new DB(c);
    db.createTask(req.body)
      .then(task => res.json({task}));
  },

  getTask(c, req, res) {
    const db = new DB(c);
    db.getTask(req.params.id)
      .then(task => res.json({task: JSON.parse(task)}));
  },

  updateTask(c, req, res) {
    const db = new DB(c);
    const task = req.body;
    task.id = req.params.id;

    db.updateTask(task)
      .then(() => db.getTask(task.id))
      .then(task => res.json({task: JSON.parse(task)}));
  },

  deleteTask(c, req, res) {
    const db = new DB(c);
    db.deleteTask(req.params.id)
      .then(() => res.status(204).send());
  },

  appendLogEntry(c, req, res) {
    const db = new DB(c);
    db.log(req.params.id, req.body)
      .then(() => res.json({ok: "logged"}));
  }
}
