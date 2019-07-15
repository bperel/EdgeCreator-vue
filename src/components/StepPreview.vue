<template>
  <v-sheet
      color="grey lighten-3"
      :class="{preview : true}">
    <v-sheet class="header" width="100%" color="rgba(0, 0, 0, .36)">
      <span class="subheading">Preview</span>
    </v-sheet>
    <v-sheet color="transparent" width="100%">
      <v-flex d-flex shrink justify-center align-top>
        <div v-if="previousEdgeUrl" class="preview-wrapper">
          <img :height="$store.getters.displayedHeight()" :src="previousEdgeUrl"/>
          <div class="preview-text">Previous edge</div>
        </div>
        <div class="preview-wrapper">
          <img :src="previewUrl"/>
          <div class="preview-text">Preview</div>
        </div>
        <div v-if="nextEdgeUrl" class="preview-wrapper">
          <img :height="$store.getters.displayedHeight()" :src="nextEdgeUrl"/>
          <div class="preview-text">Next edge</div>
        </div>
        <div v-if="model.photo" class="preview-wrapper" :style="{'margin-left': '8px'}">
          <img :height="$store.getters.displayedHeight()" :src="$store.getters.getPhotoUrl(model.photo)"/>
          <div class="preview-text">Photo&nbsp;<img src="images/photo.png" /></div>
        </div>
      </v-flex>
    </v-sheet>
  </v-sheet>
</template>

<script>
import stepOptionsMixin from '../stepOptionsMixin'
import { mapGetters, mapState } from 'vuex'
const axios = require('axios')

export default {
  name: 'StepPreview.vue',
  mixins: [stepOptionsMixin],
  props: {
    stepNumber: { default: 'final' }
  },
  data () {
    return {
      stepOptions: {},
      previousEdgeUrl: null,
      nextEdgeUrl: null
    }
  },
  computed: {
    ...mapState([
      'model',
      'zoom',
      'editingStep',
      'editingStepTweakedOptions'
    ]),
    ...mapGetters([
      'getStepPreviewUrl',
      'getEdgeUrl'
    ]),
    previewUrl () {
      let stepAndOptionsParams
      if (this.stepNumber === 'final' && Object.keys(this.editingStepTweakedOptions).length) {
        let options = this.convertFromSimpleOptions(this.editingStepTweakedOptions || {})
        stepAndOptionsParams = (this.editingStep ? this.editingStep + '.' : '') + this.objectToUrlParams(options)
      } else {
        stepAndOptionsParams = '_'
      }
      return this.getStepPreviewUrl(this.stepNumber, stepAndOptionsParams)
    }
  },
  mounted () {
    if (this.stepNumber === 'final') {
      let vm = this
      axios.post(`/numerosdispos/index/${this.model.countryCode}/${this.model.publicationCodeShort}`)
        .then(({ data }) => {
          let {
            tranches_pretes: publishedEdges,
            numeros_dispos: indexedIssues
          } = data
          let indexedIssuesKeys = Object.keys(indexedIssues)
          let indexedIssuesKeyCurrentModel = parseInt(indexedIssuesKeys.find(key => indexedIssues[key] === vm.model.issueNumber))

          let previousIssueNumber = indexedIssues[indexedIssuesKeyCurrentModel - 1]
          let previousModel = previousIssueNumber && publishedEdges[ previousIssueNumber ]

          let nextIssueNumber = indexedIssues[indexedIssuesKeyCurrentModel + 1]
          let nextModel = nextIssueNumber && publishedEdges[ nextIssueNumber ]

          this.previousEdgeUrl = previousModel ? this.getEdgeUrl(previousIssueNumber, previousModel !== 'en_cours') : null
          this.nextEdgeUrl = nextModel ? this.getEdgeUrl(nextIssueNumber, nextModel !== 'en_cours') : null
        })
    }
  }
}
</script>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
  }
  .header img {
    height: 18px;
  }
  .header .subheading {
    font-weight: bold;
    color: white;
    padding: 8px;
  }

  .preview-wrapper {
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    line-height: 14px;
    text-align: center;
  }

  .preview-wrapper .preview-text {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    width: 50px;
    text-align: right;
    transform: rotate(-90deg);
    transform-origin: 30px 25px;
  }
</style>
