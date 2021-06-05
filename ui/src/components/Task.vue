<template>
  <li class="task">
    <span @click="popup = true"
          class="icon" :style="{backgroundColor: task.color}">{{ initials }}</span>
    <h3>{{ task.title }}</h3>
    <span class="project"><label>Project</label>{{ task.project }}</span>

    <template v-if="task.blockedNote != ''">
      <span class="blocked blocked-on"><label>Blocked on</label>{{ task.blockedBy }}</span>
      <div class="blockage blocked" v-if="task.blockedNote != ''">
        <p>{{ task.blockedNote }}</p>
      </div>
    </template>

    <template v-if="task.waitingNote != ''">
      <span class="waiting last-updated"><label>Updated</label>{{ task.updated }}</span>
      <div class="blockage waiting" v-if="task.waitingNote != ''">
        <p>{{ task.waitingNote }}</p>
      </div>
    </template>

    <template v-if="task.status == 'free'">
      <span class="due-date"><label>Due</label>{{ task.due }}</span>
    </template>

    <Lightbox v-if="popup" @hide="popup = false">
      <TaskForm :task="task" @updated="updated" @closed="closed" />
    </Lightbox>
  </li>
</template>

<script>
import Lightbox from '@/components/Lightbox.vue'
import TaskForm from '@/components/TaskForm.vue'

export default {
  name: 'Task',
  components: {TaskForm,Lightbox},
  props: ['task'],
  data() {
    return {
      popup: false
    }
  },
  computed: {
    initials() {
      let s = this.task.project;
      if (!s) {
        return ''
      }
      if (s.match(/[A-Z]/)) {
        s = s.replace(/[^A-Z]/g, '');
        return s.length > 2 ? s.substr(0,2) : s;
      }
      return s.substr(0,1).toUpperCase();
    }
  },
  methods: {
    updated(task) {
      this.popup = false
      this.$emit('updated', task)
    },
    closed(task) {
      this.popup = false
      this.$emit('closed', task)
    }
  }
}
</script>

<style>
  :root {
    --icon-size: 48px;
  }
  span.icon {
    cursor: pointer;
    display: block;
    height: var(--icon-size);
    width: var(--icon-size);
    border-radius: 100%;
    grid-row: 1 / 4;
    overflow: hidden;
    text-align: center;
    line-height: calc(1.2 * var(--icon-size));
    font-size: calc(0.6 * var(--icon-size));
    font-family: sans-serif;
    color: #fff;
    font-weight: bold;
  }
</style>
