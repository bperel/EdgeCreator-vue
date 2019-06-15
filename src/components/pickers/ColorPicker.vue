<template>
  <v-flex>
    <label>Couleur :
      <input :value="color" @input="$emit('update-color', { color: $event.target.value})" type="color" />
    </label>
  </v-flex>
</template>

<script>
export default {
  name: 'ColorPicker',
  props: {
    color: String
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
