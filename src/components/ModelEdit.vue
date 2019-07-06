<template>
  <v-flex v-if="dimensions && steps.length" justify-space-between id="current-steps-and-preview">
      <v-layout id="current-steps">
          <EditableStepPreview v-for="step in steps" :key="step.Ordre"
              :stepNumber="step.Ordre"
              :stepFunctionName="step.Nom_fonction"
              :editing="editingStep === step.Ordre"
              :shouldLoad="steps[loadingStepPreview] && steps[loadingStepPreview].Ordre === step.Ordre"
              @step-preview-loaded="loadNextStepPreview"
              @start-editing="editingStep = step.Ordre"
              @tweak-options="tweakedStep=editingStep;tweakedStepOptions=$event"
              @stop-editing="editingStep = null"
          />
      </v-layout>
      <v-layout id="model-preview">
          <StepPreview
              :shouldLoad="true"
              :tweakedStep="tweakedStep"
              :tweakedStepOptions="tweakedStepOptions"
          />
      </v-layout>
  </v-flex>
</template>

<script>
import EditableStepPreview from './EditableStepPreview'
import StepPreview from './StepPreview'
import stepOptionsMixin from '../stepOptionsMixin'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'ModelEdit',
  mixins: [stepOptionsMixin],
  data () {
    return {
      steps: [],
      editingStep: null,
      loadingStepPreview: null,
      tweakedStep: undefined,
      tweakedStepOptions: {}
    }
  },
  computed: mapState([
    'zoom',
    'dimensions'
  ]),
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
        vm.setDimensions({
          width: parseInt(dimensions.Dimension_x),
          height: parseInt(dimensions.Dimension_y)
        })
      })
  },
  methods: {
    ...mapMutations([
      'setDimensions'
    ]),
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
