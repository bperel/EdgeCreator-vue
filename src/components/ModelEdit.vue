<template>
  <v-flex v-if="dimensions.width && steps.length" justify-space-between id="current-steps-and-preview">
      <v-layout wrap id="current-steps">
          <EditableStepPreview v-for="step in steps" :key="step.Ordre"
              :zoom="zoom"
              :stepNumber="step.Ordre"
              :stepFunctionName="step.Nom_fonction"
              :dimensions="dimensions"
              :editing="editingStep === step.Ordre"
              :should-load="steps[loadingStepPreview] && steps[loadingStepPreview].Ordre === step.Ordre"
              @step-preview-loaded="loadNextStepPreview"
              @start-editing="editingStep = step.Ordre"
              @stop-editing="editingStep = null"
          />
      </v-layout>
      <v-layout id="model-preview">
          <StepPreview
              :zoom="zoom"
              :should-load="true"
              :dimensions="dimensions"
          />
      </v-layout>
  </v-flex>
</template>

<script>
import EditableStepPreview from './EditableStepPreview'
import StepPreview from './StepPreview'
import stepOptionsMixin from '../stepOptionsMixin'

export default {
  name: 'ModelEdit',
  mixins: [stepOptionsMixin],
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
  watch: {
    zoom: function () {
      this.loadingStepPreview = 0
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
        let dimensions = vm.convertToSimpleOptions(data)
        vm.dimensions = {
          width: parseInt(dimensions.Dimension_x),
          height: parseInt(dimensions.Dimension_y)
        }
      })
  },
  methods: {
    loadNextStepPreview: function () {
      this.loadingStepPreview++
      if (this.steps[this.loadingStepPreview] === undefined) {
        this.loadingStepPreview = -1
        console.debug('Reached last step')
      } else {
        console.debug('New step to preview : ' + this.loadingStepPreview)
      }
    }
  },
  components: {
    EditableStepPreview,
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

  #model-preview {
    flex-grow: 0;
  }
</style>
