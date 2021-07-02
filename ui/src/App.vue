<template>
  <div id="main">
    <h1>{{ title }}</h1>
    <button id="new-task" @click="newTask = true">Add</button>
    <Lightbox v-if="newTask" @hide="newTask = false">
      <TaskForm @updated="updated" :task="blankTask()" />
    </Lightbox>
    <Board
      :projects=projects
      :context=context
      :waiting=waiting
      :free=free
      :blocked=blocked
      :review=review
      @updated="updated"
      @closed="close" />
  </div>
</template>

<script>
import Board from '@/components/Board'
import Lightbox from '@/components/Lightbox'
import TaskForm from '@/components/TaskForm'
export default {
  name: 'App',
  components: {Board,Lightbox,TaskForm},

  data() {
    let q = Object.fromEntries(document.location.search.replace(/^\?/, '').split(/&/).map(s => s.split(/=/)));
    if (q.c) {
      document.title = `${q.c} | workboard`
    } else {
      document.title = `workboard`
    }

    return {
      title:   'Workboard!',

      waiting: [],
      free:    [],
      blocked: [],
      review:  [],

      projects: {},

      newTask: false,

      context: q.c
    }
  },

  methods: {
    u(rel) {
      return (this.context ? `/w/_/${this.context}` : '/w') + rel;
    },
    sync() {
      console.log('syncing tasks...');
      fetch('/w')
        .then(r => r.json())
        .then(the => {
          this.title = this.context ? `${the.title} (${this.context})` : the.title
        })

      fetch(this.u('/tasks'))
        .then(r => r.json())
        .then(the => {
          this.free = [];
          this.blocked = [];
          this.waiting = [];
          this.review  = [];
          this.projects = {};
          the.tasks.forEach(task => {
            if (!task) {
              return;
            }
            if (typeof(task.project) !== 'undefined' && !(task.project in this.projects)) {
              this.projects[task.project] = task.color
            }
            let seen = false
            if (task.blockedNote != '') {
              this.blocked.push(task);
              seen = true
            }
            if (task.waitingNote != '') {
              this.waiting.push(task);
              seen = true
            }
            if (!seen) {
              switch (task.status) {
                case 'free':    this.free.push(task);    break;
                case 'review':  this.review.push(task);  break;
              }
            }
          })
        })
    },
    blankTask() {
      return {
        status: "free",
        waitingNote: '',
        blockedNote: '',
      }
    },
    updated(task) {
      this.newTask = false
      const p = ('id' in task)
              ? fetch(this.u(`/task/${task.id}`), {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(task),
                })
              : fetch(this.u('/tasks'), {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(task),
                })
      p.then(r => r.json())
       .then(task => this.sync(task))
    },
    close(task) {
      fetch(this.u(`/task/${task.id}`), { method: 'DELETE' })
        .then(() => this.sync())
    },
  },

  mounted() {
    this.sync()
  }
}
</script>

<style>
@import 'assets/style.css';
</style>
