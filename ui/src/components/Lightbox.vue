<template>
  <div class="lightbox" @click.self="$emit('hide')">
    <div><slot /></div>
  </div>
</template>

<script>
export default {
  name: 'Lightbox',
  mounted() {
    document.body.style.overflow = 'hidden';
  },
  destroyed() {
    document.body.style.overflow = '';
  }
}
</script>

<style>
  .lightbox {
    transition: display 8s ease-in-out 0.5s;
    display: grid;
    position: fixed;
    overflow-y: auto;
    top: 0; right: 0; bottom: 0; left: 0;
    background-color: #000000dd;

    grid-template-columns: 10vw 1fr 10vw;
    grid-template-rows:    10vh 1fr 10vh;
  }
  .lightbox > div {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    background-color: #fff;
    padding: 1em;
    overflow-y: auto;
    position: relative;
  }
</style>
