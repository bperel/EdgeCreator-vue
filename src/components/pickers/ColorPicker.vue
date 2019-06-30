<template>
  <v-flex>
    <label>{{ label }} :
      <input :value="color" @input="$emit('update-color', { color: $event.target.value})" type="color" />
    </label>
  </v-flex>
</template>

<script>
export default {
  name: 'ColorPicker',
  props: {
    color: String,
    label: {
      default: 'Couleur'
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
