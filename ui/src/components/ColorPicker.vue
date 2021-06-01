<template>
  <div class="color-picker">
    <input type="hidden" :name="name" :value="value">
    <span v-for="color in colors" :key="color"
          @click.self="$emit('input', `#${color}`)"
          :class="{
            selected: value == `#${color}`
          }"
          :style="{
            backgroundColor: `#${color}`
          }" />
  </div>
</template>

<script>
export default {
  name: 'ColorPicker',
  props: ['name', 'value', 'palette'],
  data() {
    return {
      colors: this.palette ? this.palette : [
        'd53e4f',
        'f46d43',
        'fdae61',
        'fee08b',
        'ffffbf',
        'e6f598',
        'abdda4',
        '66c2a5',
        '3288bd'
      ],
    }
  }
}
</script>

<style scoped>
  .color-picker {
    display: grid;
    grid-template-columns: repeat(3, 20px);
    gap: 8px;
  }
  .color-picker span {
    display: block;
    height: 20px; width: 20px;
    border: 1px solid #222;
    cursor: pointer;
  }
  .color-picker span.selected {
    box-shadow: 0 0 5px #880086;
  }
</style>
