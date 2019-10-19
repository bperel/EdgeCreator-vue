<template>
  <div>
    <slot name="canvas-override"/>
    <div class="options-editor" :style="{height: `${displayedHeight()}px`}">
      <div class="options-editor-contents">
        <v-alert outlined color="blue" type="info" style="background: white">
          <slot name="instructions" />
        </v-alert>
        <slot />
      </div>
      <v-footer absolute class="justify-space-between">
        <v-btn @click.stop="cancelStep" :disabled="!stepOptionsHaveBeenTweaked()">Annuler</v-btn>
        <v-btn @click.stop="saveStep" :disabled="!stepOptionsHaveBeenTweaked()">Valider</v-btn>
      </v-footer>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import stepOptionsMixin from '../stepOptionsMixin'
const axios = require('axios')

export default {
  name: 'StepFunction',
  mixins: [stepOptionsMixin],
  props: {
    options: Object
  },
  computed: {
    ...mapGetters([
      'addZoom',
      'removeZoom',
      'displayedWidth',
      'displayedHeight',
      'stepOptionsHaveBeenTweaked'
    ]),
    ...mapState([
      'editingStep',
      'editingStepInitialOptions',
      'editingStepTweakedOptions'
    ])
  },
  methods: {
    ...mapMutations([
      'setEditingStepTweakedOptions',
      'updateLastPreviewGenerationTime',
      'stopEditing'
    ]),

    updatePreview: function (newOptions = {}) {
      this.setEditingStepTweakedOptions({ ...newOptions })
    },

    cancelStep: function () {
      this.setEditingStepTweakedOptions({ ...this.editingStepInitialOptions })
    },

    saveStep: function () {
      let vm = this
      let options = this.convertFromSimpleOptions(this.editingStepTweakedOptions || {})
      axios.post(`/update_wizard/index/${this.editingStep}/${this.objectToUrlParams(options)}`).then(({ data }) => {
        vm.updateLastPreviewGenerationTime(vm.editingStep)
        vm.updateLastPreviewGenerationTime('final')
        vm.stopEditing()
      })
    }
  }
}
</script>

<style>
  ul {
    color: black;
  }

  .options-editor-contents {
    height: calc(100% - 60px);
    overflow-y: auto;
  }
</style>
