<template>
  <div class="board">
    <input id="q" placeholder="filter by project name..." v-model="q" />
    <div class="waiting-on-me">
      <h2>Waiting on Me</h2>
      <div v-if="waiting.length == 0" class="no-data">
        You're not blocking anyone!  Go you! 🎉
      </div>
      <div v-else-if="waitingTasks.length == 0" class="no-data">
        No <em>matching</em> blockers found, so that's a start...
      </div>
      <ul v-else>
        <Task v-for="task in waitingTasks" :task="task" :key="task.id" @updated="updated" @closed="closed"/>
      </ul>
    </div>

    <div class="out-for-review">
      <h2>Out for Review</h2>
      <div v-if="review.length == 0" class="no-data">
        <p>Nothing is out for review.<br>Time to dig into that backlog! 🎉</p>
      </div>
      <div v-else-if="reviewTasks.length == 0" class="no-data">
        <p>There <em>is</em> stuff out for review,<br>but not matching your filter criteria...</p>
      </div>
      <ul v-else>
        <Task v-for="task in reviewTasks" :task="task" :key="task.id" @updated="updated" @closed="closed"/>
      </ul>
    </div>

    <div class="free-and-clear">
      <h2>Free &amp; Clear</h2>
      <div v-if="free.length == 0" class="no-data">
        <p>The easy part is done.  Now go do some bizdev! 🎉</p>
      </div>
      <div v-else-if="freeTasks.length == 0" class="no-data">
        <p>Nothing(-ish) is free and clear,<br>maybe try a different filter?</p>
      </div>
      <ul v-else>
        <Task v-for="task in freeTasks" :task="task" :key="task.id" @updated="updated" @closed="closed"/>
      </ul>
    </div>

    <div class="blocked">
      <h2>Blocked</h2>
      <div v-if="blocked.length == 0" class="no-data">
        <p>No tasks are blocked by others.  Go team! 🎉</p>
      </div>
      <div v-else-if="blockedTasks.length == 0" class="no-data">
        <p>No (matching) tasks are blocked by others.<br>That's good, right?</p>
      </div>
      <ul v-else>
        <Task v-for="task in blockedTasks" :task="task" :key="task.id" @updated="updated" @closed="closed"/>
      </ul>
    </div>
  </div>
</template>

<script>
import Task from '@/components/Task'
export default {
  name: 'Board',
  props: ['context', 'waiting', 'blocked', 'free', 'review'],
  components: {Task},
  data() {
    return {
      q: ''
    }
  },
  methods: {
    updated(task) {
      this.$emit('updated', task)
    },
    closed(task) {
      this.$emit('closed', task)
    }
  },
  computed: {
    waitingTasks() {
      return this.waiting.filter(t => this.q ? t.project.match(this.q) : true)
    },
    blockedTasks() {
      return this.blocked.filter(t => this.q ? t.project.match(this.q) : true)
    },
    freeTasks() {
      return this.free.filter(t => this.q ? t.project.match(this.q) : true)
    },
    reviewTasks() {
      return this.review.filter(t => this.q ? t.project.match(this.q) : true)
    }
  }
}
</script>

<style>
#q {
  grid-column: 1/3;
  font-size: 16pt;
  padding: 1em 1.5em;
}
</style>
