<template>
  <div id="main">
    <h1>{{ title }}</h1>
    <button id="new-task" @click="newTask = true">Add</button>
    <Lightbox v-if="newTask" @hide="newTask = false">
      <TaskForm @updated="updated" :task="blankTask()" />
    </Lightbox>
    <Board
      :waiting=waiting
      :free=free
      :blocked=blocked
      :review=review
      @updated="updated" />
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
    return {
      title:   'Workboard!',

      waiting: [],
      free:    [],
      blocked: [],
      review:  [],

      newTask: false,
    }
  },

  methods: {
    sync() {
      console.log('syncing tasks...');
      fetch('/w')
        .then(r => r.json())
        .then(the => {
          this.title = the.title
        })

      fetch('/w/tasks')
        .then(r => r.json())
        .then(the => {
          this.free = [];
          this.blocked = [];
          this.waiting = [];
          this.review  = [];
          the.tasks.forEach(task => {
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
      this.sync(task)
    }
  },

  mounted() {
    this.sync()
  }
}
</script>

<style>
@import 'assets/style.css';
</style>
