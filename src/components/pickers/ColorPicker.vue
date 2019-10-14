<template>
  <div class="d-flex">
    <label>{{ label }} :
      <input :value="color" @input="emitColorChangeEvent" type="color" />
    </label>
  </div>
</template>

<script>
export default {
  name: 'ColorPicker',
  props: {
    color: String,
    label: {
      default: 'Couleur'
    },
    fieldName: {
      default: 'color'
    }
  },
  methods: {
    emitColorChangeEvent ($event) {
      let eventOptions = {}
      eventOptions[this.fieldName] = $event.target.value
      this.$emit('update-color', eventOptions)
    }
  }
}
</script>

<style scoped>
  label {
    display: flex;
    align-items: center;
  }
  input[type=color] {
    margin-left: 5px;
  }
</style>
