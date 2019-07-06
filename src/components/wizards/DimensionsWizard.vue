<template>
  <v-card>
    <v-form v-model="valid">
      <v-card-title>
        <span class="headline">Dimensions de la tranche</span>
      </v-card-title>
      <v-card-text>
          <v-text-field
              v-model="dimensions.width"
              label="Largeur"
              :rules="dimensionRule"
              required
          />
          <v-text-field
              v-model="dimensions.height"
              label="Hauteur"
              :rules="dimensionRule"
              required
          />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!valid" @click="setDimensions(dimensions) ; $emit('close-dialog')" color="blue darken-1" flat>OK</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'DimensionsWizard',
  computed: mapState([
    'dimensions'
  ]),
  data: () => ({
    valid: true,
    dimensionRule: [
      v => /^[0-9]+$/.test(v) || 'Each of the dimensions should be a number'
    ]
  }),
  methods: mapMutations([
    'setDimensions'
  ])
}
</script>

<style scoped>
</style>
