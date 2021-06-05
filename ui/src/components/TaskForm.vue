<template>
  <div>
    <header>
      <ColorPicker name="color" v-model="color" />
      <input type="text" name="title"   v-model="title">
      <input type="text" name="project" v-model="project">

      <div class="status-selector" :class="{waiting: isWaiting, review: isReview, free: isFree, blocked: isBlocked}">
        <button class="waiting" @click="pickWaiting()">Waiting on me</button>
        <button class="blocked" @click="pickBlocked()">Blocked</button>
        <button class="free"    @click="pickFree()"   >Free &amp; Clear</button>
        <button class="review"  @click="pickReview()" >Out for review</button>
      </div>
    </header>

    <form @submit="submit($event)">
      <div v-if="isWaiting" class="entry waiting">
        <label>Waiting for me to:</label>
        <textarea name="waitingNote" v-model="waitingNote" placeholder="what do you still need to do?"></textarea>
      </div>
      <div v-else-if="task.waitingNote != ''" class="entry waiting will-be-cleared">
        <label>Waiting for me to:</label>
        <div class="note">{{ task.waitingNote }}</div>
        <p>(the above "waiting-on" status will be cleared)</p>
      </div>

      <div v-if="isBlocked" class="entry blocked">
        <label>Waiting for somebody else:</label>
        <input type="text" name="blockedBy" v-model="blockedBy" placeholder="who are you waiting on?">
        <textarea name="blockedNote" v-model="blockedNote" placeholder="what are you waiting on them to do?"></textarea>
      </div>
      <div v-else-if="task.blockedNote != ''" class="entry blocked will-be-cleared">
        <label>Waiting for somebody else:</label>
        <div class="note">{{ task.blockedNote }}</div>
        <p>(the above "blocked-on" status will be cleared)</p>
      </div>

      <div class="notes">
        <label>Notes</label>
        <textarea name="notes" v-model="notes" />
        <div><button>Save</button></div>
      </div>
    </form>
  </div>
</template>

<script>
import ColorPicker from '@/components/ColorPicker'

export default {
  name: 'TaskForm',
  components: {ColorPicker},
  props: ['task'],
  data() {
    return {
      title:       this.task.title,
      project:     this.task.project,
      status:      this.task.status,
      color:       this.task.color,
      isWaiting:   this.task.waitingNote != '',
      isFree:      this.task.status == 'free',
      isReview:    this.task.status == 'review',
      isBlocked:   this.task.blockedNote != '',
      notes:       this.task.notes,

      waitingNote: this.task.waitingNote,
      blockedNote: this.task.blockedNote,
      blockedBy:   this.task.blockedBy,
    }
  },

  methods: {
    submit(event) {
      event.preventDefault();

      const data = {
        ...this.task,
        title:   this.title,
        project: this.project,
        status:  this.status,
        color:   this.color,
        notes:   this.notes,
        waitingNote: this.isWaiting ? this.waitingNote : '',
        blockedBy:   this.isBlocked ? this.blockedBy   : '',
        blockedNote: this.isBlocked ? this.blockedNote : '',
      }
      event.target.elements.forEach(e => {if (e.name != '') { data[e.name] = e.value }})

      const p = ('id' in this.task)
              ? fetch(`/w/task/${this.task.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                })
              : fetch('/w/tasks', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                })
      p.then(r => r.json())
       .then(task => this.$emit('updated', task))
    },

    pickWaiting() {
      this.status = 'waiting'
      this.isWaiting = !this.isWaiting;
      if (this.isWaiting) {
        this.isReview = this.isFree = false;
      }
    },
    pickBlocked() {
      this.status = 'blocked'
      this.isBlocked = !this.isBlocked;
      if (this.isBlocked) {
        this.isReview = this.isFree = false;
      }
    },
    pickFree() {
      this.status = 'free'
      this.isFree = !this.isFree;
      if (this.isFree) {
        this.isReview = this.isWaiting = this.isBlocked = false;
      }
    },
    pickReview() {
      this.status = 'review'
      this.isReview = !this.isReview;
      if (this.isReview) {
        this.isFree = this.isWaiting = this.isBlocked = false;
      }
    },
  }
}
</script>

<style scoped>
header {
  display: grid;
  grid-template-columns: 76px 1fr 100px;
  gap: 12pt;
  background-color: transparent;
  color: #111;
}
header .color-picker {
  grid-column: 1 / 2;
  grid-row:    1 / 3;
}
header input[name="title"] {
  grid-column: 2 / 4;
  grid-row:    1 / 2;
}
header input[name="project"] {
  grid-column: 2 / 4;
  grid-row:    2 / 3;
}
header .status {
  grid-column: 2 / 3;
  grid-row:    3 / 4;
}
label {
  display: inline !important;
}
header .status-picker {
  grid-column: 3 / 4;
  grid-row: 3 / 4;
}
.status-picker {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4pt;
}
.status-picker span {
  width: 48px;
  height: 48px;
  cursor: pointer;
  border: 2px solid transparent;
  opacity: 0.7;
}
.status-picker span.waiting { background-color: #a1f99aff; }
.status-picker span.review  { background-color: #67bcedff; }
.status-picker span.free    { background-color: #f469f9ff; }
.status-picker span.blocked { background-color: #fdc94eff; }

.status-picker.waiting span.waiting,
.status-picker.review span.review,
.status-picker.free span.free,
.status-picker.blocked span.blocked {
  border-color: #333;
  opacity: 1;
}

.status-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4pt;
  grid-column: 1 / 4;
}
.status-selector button {
  font-size: 12pt;
  padding: 1em 2em;
  border: 2px solid transparent;
  border-radius: 0.5em;
  font-weight: bold;
  opacity: 0.4;
}
.status-selector button.waiting { background-color: #a1f99aff; }
.status-selector button.review  { background-color: #67bcedff; }
.status-selector button.free    { background-color: #f469f9ff; }
.status-selector button.blocked { background-color: #fdc94eff; }
.status-selector.waiting button.waiting,
.status-selector.review  button.review,
.status-selector.free    button.free,
.status-selector.blocked button.blocked {
  border-color: #333;
  opacity: 1;
}

input, input:focus, input:hover,
textarea, textarea:focus, textarea:hover {
  outline: none;
  border-bottom: 2px solid #ccc;
  border-width: 0 0 1px 0;
  padding: 0;
  line-height: 1em;
  font-family: sans-serif;
}
input[name="title"] {
  font: 22pt/36pt sans-serif;
  padding: 2pt;
}

form {
  padding: 2em 1em;
}
form,
form > div {
  display: grid;
  gap: 1em;
}
form {
  grid-template-columns: repeat(2, 1fr);
}
form input, form input:focus, form input:hover,
form textarea, form textarea:focus, form textarea:hover {
  border: 1px solid #ccc;
}
form textarea {
  min-height: 6em;
}

form h2 {
  border: none;
}
form .to-be-cleared label,
form .to-be-cleared div.note {
  text-decoration: line-through;
  font-style: italic;
  opacity: 0.3;
}
form .entry.waiting textarea {
  height: 9em;
}
form .entry .note,
form .entry textarea,
form .entry input {
  border: 1px solid transparent;
  padding: 0.75em;
}
form .entry.will-be-cleared .note,
form .entry.will-be-cleared textarea,
form .entry.will-be-cleared input {
  opacity: 0.3;
}
form .entry.waiting .note,
form .entry.waiting textarea,
form .entry.waiting input {
  background-color: var(--waiting-bg);
  border-color:     var(--waiting-border);
}
form .entry.blocked .note,
form .entry.blocked textarea,
form .entry.blocked input {
  background-color: var(--blocked-bg);
  border-color:     var(--blocked-border);
}
form .notes {
  grid-column: 1 / 3;
  gap: 4pt;
}
form .notes textarea {
  background-color: #0e6cbf61;
  border: 1px solid #0e6cbf;
  padding: 0.75em;
}
form button {
  font: 10pt/22pt sans-serif;
  font-weight: bold;
  background-color: #0e6cbf;
  color: white;
  border: 0;
  border-radius: 4pt;
  padding: 3pt 12pt;
  cursor: pointer;
  box-shadow: 0 0 5pt #ccc;
}
form label {
  font: 16pt/18pt sans-serif;
  margin-top: 1em;
}

@media screen and (max-width: 700px) {
  .status-selector {
    grid-template-columns: 1fr;
  }
  form > div {
    grid-column: 1 / 3;
  }
}
</style>
