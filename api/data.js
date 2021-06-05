const Redis = require("ioredis");
const process = require("process");

const Status = {
  free:    'free',
  waiting: 'waiting',
  blocked: 'blocked',
  review:  'review',
};

module.exports = class {
  constructor(prefix = null) {
    this.p = prefix
    this.r = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST);
  }

  key(k) {
    return this.p ? `${this.p}:${k}` : k
  }

  getTasks() {
    return this.r.lrange(this.key('tasks'), 0, -1)
      .then(ids => {
        return Promise.all(ids.map(id => {
          return new Promise((resolve, reject) => {
            this.r.get(this.key(`task:${id}`))
                  .then(task => resolve(JSON.parse(task)));
          })
        }));
      });
  }

  createTask(task) {
    return this.r.incr(this.key('nextid'))
               .then(id => {
                 task.id = id;
                 return this.updateTask(task)
                            .then(() => this.r.rpush(this.key('tasks'), id))
               });
  }

  updateTask(task) {
    return this.r.set(this.key(`task:${task.id}`), JSON.stringify(task));
  }

  getTask(id) {
    return this.r.get(this.key(`task:${id}`))
  }

  deleteTask(id) {
    return this.r.del(this.key(`task:${id}`))
  }

  log(id, event) {
    return this.r.rpush(this.key(`log:${id}`, JSON.stringify(event)));
  }
};
