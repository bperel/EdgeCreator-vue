<template>
  <v-flex>
    <v-btn v-for="edgeModel in models" :key="edgeModel.id" :disabled="disabled" small v-bind:style="{ backgroundImage: 'url(\'' + getCountryFlag(edgeModel) + '\')'}">
      {{ edgeModel.magazine_complet}} n°{{ edgeModel.numero }}
    </v-btn>
  </v-flex>
</template>

<script>
export default {
  name: 'EdgeModelButtonList',
  props: {
    models: Array,
    disabled: Boolean
  },
  computed: {
    getCountryFlag () {
      return edge => `images/flags/${edge.pays}.png`
    }
  }
}
</script>

<style scoped>
  .v-btn {
    display: block;
    padding-left: 32px !important;
    background-repeat: no-repeat !important;
    background-position: 10px !important;
    text-transform: none;
    justify-content: flex-start;
  }

  .v-btn.v-btn--disabled.theme--light {
    color: black !important;
  }
</style>
