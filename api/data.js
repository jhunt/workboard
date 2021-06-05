const Redis = require("ioredis");
const process = require("process");

const Status = {
  free:    'free',
  waiting: 'waiting',
  blocked: 'blocked',
  review:  'review',
};

module.exports = class {
  constructor() {
    this.r = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST);
  }

  getTasks() {
    return this.r.lrange('tasks', 0, -1)
      .then(ids => {
        return Promise.all(ids.map(id => {
          return new Promise((resolve, reject) => {
            this.r.get(`task:${id}`)
                  .then(task => resolve(JSON.parse(task)));
          })
        }));
      });
  }

  createTask(task) {
    return this.r.incr('nextid')
               .then(id => {
                 task.id = id;
                 return this.updateTask(task)
                            .then(() => this.r.rpush(`tasks`, id))
               });
  }

  updateTask(task) {
    return this.r.set(`task:${task.id}`, JSON.stringify(task));
  }

  getTask(id) {
    return this.r.get(`task:${id}`)
  }

  deleteTask(id) {
    return this.r.del(`task:${id}`)
  }

  log(id, event) {
    return this.r.rpush(`log:${id}`, JSON.stringify(event));
  }
};
