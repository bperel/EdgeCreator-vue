<template>
  <v-flex justify-space-between id="current-steps-and-preview">
      <v-layout wrap id="current-steps">
          <v-sheet
              v-for="step in steps" :key="step.Ordre"
              color="grey lighten-3"
              :class="{preview : true, 'step-preview': true, editing : editingStep === step.Ordre}"
              :width="stepWidth"
              @click="editingStep = step.Ordre">
            <v-sheet class="header" width="100%" color="rgba(0, 0, 0, .36)">
              <img :src="`/images/fonctions/${step.Nom_fonction}.png`" />
            </v-sheet>
            <v-sheet color="transparent" width="100%">
              <div>{{ step }}</div>
            </v-sheet>
          </v-sheet>
      </v-layout>
  </v-flex>
</template>

<script>
export default {
  name: 'ModelEdit',
  props: {
    model: Object,
    zoom: Number
  },
  data () {
    return {
      steps: [],
      editingStep: null,
      dimensions: {},
      MIN_STEP_WIDTH: 30
    }
  },
  computed: {
    previewWidth: function () {
      return this.dimensions.width * this.zoom
    },
    stepWidth: function () {
      return Math.max(this.previewWidth, this.MIN_STEP_WIDTH)
    }
  },
  mounted () {
    const axios = require('axios')
    let vm = this
    axios.post('/parametrageg_wizard/index')
      .then(function ({ data }) {
        vm.steps = data.filter(step => step.Ordre !== -1) || []
      })
    axios.post('/parametrageg_wizard/index/-1')
      .then(function ({ data }) {
        let {
          Dimension_x: {
            valeur: width
          },
          Dimension_y: {
            valeur: height
          }
        } = data
        vm.dimensions = { width: parseInt(width), height: parseInt(height) }
      })
  }
}
</script>

<style scoped>
  #current-steps-and-preview {
    padding-top: 80px;
    width: 100%;
    box-sizing: border-box;
  }

  #current-steps {
    overflow-x: auto;
    padding: 0 20px;
  }

  .preview {
    margin-left: 15px;
    margin-right: 15px;
  }

  .preview .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
  }

  .preview .header img {
    width: 18px;
    height: 18px;
  }

  .step-preview {
    position: static;
    vertical-align: top;
    display: inline-block;
    white-space: normal;
  }

  .step-preview:not(.editing) {
    cursor: pointer;
  }
</style>
