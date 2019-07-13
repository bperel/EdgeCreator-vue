<template>
  <v-flex v-if="dimensions && steps.length" justify-space-between id="current-steps-and-preview">
      <v-layout id="current-steps">
          <EditableStepPreview v-for="step in steps" :key="step.Ordre"
              :stepNumber="step.Ordre"
              :stepFunctionName="step.Nom_fonction"
          />
      </v-layout>
      <v-layout id="model-preview">
          <StepPreview />
      </v-layout>
  </v-flex>
</template>

<script>
import EditableStepPreview from './EditableStepPreview'
import StepPreview from './StepPreview'
import stepOptionsMixin from '../stepOptionsMixin'
import { mapMutations, mapState } from 'vuex'
const axios = require('axios')

export default {
  name: 'ModelEdit',
  mixins: [stepOptionsMixin],
  computed: mapState([
    'dimensions',
    'steps'
  ]),
  mounted () {
    let vm = this
    axios.post('/parametrageg_wizard/index')
      .then(({ data }) => {
        vm.setSteps(data.filter(step => step.Ordre !== -1) || [])
        vm.setLoadingStep(vm.steps[0].Ordre)
      })

    axios.post('/parametrageg_wizard/index/-1')
      .then(({ data }) => {
        const dimensions = vm.convertToSimpleOptions(data)
        vm.setDimensions({
          width: parseInt(dimensions.Dimension_x),
          height: parseInt(dimensions.Dimension_y)
        })
      })
  },
  methods: {
    ...mapMutations([
      'setDimensions',
      'setSteps',
      'setLoadingStep',
      'loadNextStep',
      'startEditing'
    ])
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
