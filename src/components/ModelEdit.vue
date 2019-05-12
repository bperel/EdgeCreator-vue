<template>
  <v-flex v-if="dimensions.width && steps.length" justify-space-between id="current-steps-and-preview">
      <v-layout wrap id="current-steps">
          <StepPreview
              v-for="step in steps" :key="step.Ordre"
              :zoom="zoom"
              :step="step"
              :dimensions="dimensions"
              :editing="editingStep === step.Ordre"
              :should-load="steps[loadingStepPreview] && steps[loadingStepPreview].Ordre === step.Ordre"
              @stepPreviewLoaded="loadingStepPreview++"
              @editing="editingStep = step.Ordre"
          />
      </v-layout>
  </v-flex>
</template>

<script>
import StepPreview from './StepPreview'
import { convertToSimpleOptions } from '../util'

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
      loadingStepPreview: null,
      dimensions: {}
    }
  },
  mounted () {
    const axios = require('axios')
    let vm = this
    axios.post('/parametrageg_wizard/index')
      .then(function ({ data }) {
        vm.steps = data.filter(step => step.Ordre !== -1) || []
        vm.loadingStepPreview = 0
      })

    axios.post('/parametrageg_wizard/index/-1')
      .then(function ({ data }) {
        let dimensions = convertToSimpleOptions(data)
        vm.dimensions = {
          width: parseInt(dimensions.Dimension_x),
          height: parseInt(dimensions.Dimension_y)
        }
      })
  },
  components: {
    StepPreview
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
