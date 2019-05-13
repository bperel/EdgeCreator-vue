<template>
  <v-sheet
      color="grey lighten-3"
      :class="{preview : true, 'step-preview': true, editing}"
      @click.stop="!editing && editStep()">
    <v-sheet class="header" width="100%" color="rgba(0, 0, 0, .36)">
      <img :src="`/images/fonctions/${step.Nom_fonction}.png`" />
      <span v-if="editing" class="function-name">{{ step.Nom_fonction }}</span>
    </v-sheet>
    <v-sheet color="transparent" width="100%">
      <v-flex d-flex justify-start align-top>
        <img v-if="loadPreview" ref="stepPreview" :src="previewUrl" @load="$emit('step-preview-loaded')"/>
        <v-layout d-flex column align-content-space-between class="step-options-wrapper" v-if="editing">
          <v-sheet>
            <div v-switch="step.Nom_fonction">
              <Fill v-case="'Remplir'" :zoom="zoom" :options="stepOptions" :stepPreviewImg="$refs.stepPreview" @options-changed="updatePreview" />
            </div>
          </v-sheet>
          <v-layout justify-end style="flex-grow: 0 !important;">
            <v-btn v-for="action in availableActions" @click.stop="action.click" :key="action.id" left>
              {{ action.title }}
            </v-btn>
          </v-layout>
        </v-layout>
      </v-flex>
    </v-sheet>
    <ConfirmCancelEditWizard
        v-if="cancelEditRequested"
        @close-dialog="cancelEditRequested = false"
        @cancel-edit="cancelEditRequested = false; $emit('stop-editing')" />
  </v-sheet>
</template>

<script>
import Fill from './step-functions/Fill'
import stepOptionsMixin from '../stepOptionsMixin'
import ConfirmCancelEditWizard from './wizards/ConfirmCancelEditWizard'
const axios = require('axios')

export default {
  name: 'StepPreview.vue',
  components: { ConfirmCancelEditWizard, Fill },
  mixins: [stepOptionsMixin],
  props: {
    zoom: Number,
    shouldLoad: Boolean,
    step: Object,
    editing: Boolean,
    dimensions: Object
  },
  data () {
    return {
      loadPreview: false,
      cancelEditRequested: false,
      stepOptions: {},
      tweakedStepOptions: null,
      previewUrl: '',
      availableActions: [{
        id: 'close', title: 'Fermer', click: this.requestCancelEditing
      }, {
        id: 'validate', title: 'Valider', click: this.requestCancelEditing
      }],
      MIN_STEP_WIDTH: 36
    }
  },
  watch: {
    shouldLoad: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.loadPreview = true
        }
      }
    }
  },
  methods: {
    editStep: function () {
      let vm = this
      axios.post(`/parametrageg_wizard/index/${this.step.Ordre}`)
        .then(function ({ data }) {
          vm.stepOptions = vm.convertToSimpleOptions(data)
          vm.$emit('start-editing')
        })
    },
    requestCancelEditing: function () {
      if (!this.tweakedStepOptions || this.stepOptions === this.tweakedStepOptions) {
        this.$emit('stop-editing')
      } else {
        this.cancelEditRequested = true
      }
    },
    updatePreview: function (newOptions) {
      this.tweakedStepOptions = Object.assign({}, newOptions)
      this.setPreviewUrl()
    },
    setPreviewUrl: function () {
      this.previewUrl = `/viewer_wizard/etape/${this.zoom}/${this.step.Ordre}/${this.objectToUrl(this.tweakedStepOptions || this.stepOptions)}/false/false/false/${Math.random()}`
    }
  },
  mounted () {
    this.setPreviewUrl()
  }
}
</script>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
  }
  .header img {
    height: 18px;
  }

  .header .function-name {
    font-weight: bold;
    color: white;
  }

  img {
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    margin: 0 8px;
  }

  .step-options-wrapper {
    margin: 16px 16px 16px 8px ;
  }

  .step-options-wrapper > div {
    padding: 8px;
  }
</style>
