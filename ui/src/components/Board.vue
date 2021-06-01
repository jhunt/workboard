<template>
  <div class="board">
    <div class="waiting-on-me">
      <h2>Waiting on Me</h2>
      <div v-if="waiting.length == 0" class="no-data">
        You're not blocking anyone!  Go you! 🎉
      </div>
      <ul v-else>
        <Task v-for="task in waiting" :task="task" :key="task.id" @updated="updated"/>
      </ul>
    </div>

    <div class="out-for-review">
      <h2>Out for Review</h2>
      <div v-if="review.length == 0" class="no-data">
        <p>Nothing is out for review.<br>Time to dig into that backlog! 🎉</p>
      </div>
      <ul v-else>
        <Task v-for="task in review" :task="task" :key="task.id" @updated="updated"/>
      </ul>
    </div>

    <div class="free-and-clear">
      <h2>Free &amp; Clear</h2>
      <div v-if="free.length == 0" class="no-data">
        The easy part is done.  Now go do some bizdev! 🎉
      </div>
      <ul v-else>
        <Task v-for="task in free" :task="task" :key="task.id" @updated="updated"/>
      </ul>
    </div>

    <div class="blocked">
      <h2>Blocked</h2>
      <div v-if="blocked.length == 0" class="no-data">
        No tasks are blocked by others.  Go team! 🎉
      </div>
      <ul v-else>
        <Task v-for="task in blocked" :task="task" :key="task.id" @updated="updated"/>
      </ul>
    </div>
  </div>
</template>

<script>
import Task from '@/components/Task'
export default {
  name: 'Board',
  props: ['waiting', 'blocked', 'free', 'review'],
  components: {Task},
  methods: {
    updated(task) {
      console.log('board task update detected; propagating');
      this.$emit('updated', task)
    }
  }
}
</script>

<style>
</style>
