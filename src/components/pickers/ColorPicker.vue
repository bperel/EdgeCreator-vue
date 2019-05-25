<template>
  <v-flex d-flex align-center>
    <label>Sélectionnez une couleur :
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

</style>
