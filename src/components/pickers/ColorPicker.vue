<template>
  <div>
    <v-input>
      <label class="v-label v-label--active theme--light">{{ label }}</label>
      <input slot="default" :value="color" @input="emitColorChangeEvent" type="color" />
    </v-input>
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
