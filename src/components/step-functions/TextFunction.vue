<template>
  <StepFunction>
    <template #canvas-override>
      <Draggable
          :scalable="true"
          :rotatable="true"
          :x="shownX"
          :y="shownY"
          :width="shownWidth"
          :height="shownHeight"
          :angle="-1 * tweakedStepOptions.Rotation"
          @update-position="updatePreview">
        <img ref="image"
             v-show="loaded"
             @load="loaded = true; calculateImageRatio($refs.image)"
             :src="textPreviewUrl"
             :style="{width: '100%', height: '100%'}"/>
      </Draggable>
    </template>
    <template #instructions>
      <ul>
        Modifiez, déplacez et redimensionnez le texte.
      </ul>
    </template>

    <v-flex d-block>
      <v-text-field
          v-model.lazy="tweakedStepOptions.URL"
          @change="tweakedStepOptions.URL = tweakedStepOptions.URL.replace(/\//g, '.'); updatePreview()"
          label="Police de caractères"
          required
      />
      <v-text-field
          v-model.lazy="tweakedStepOptions.Chaine"
          @change="updatePreview()"
          label="Texte"
          required
      />
      <ColorPicker
          :color="tweakedStepOptions.Couleur_texte"
          label="Couleur du texte"
          @update-color="updatePreview"/>
      <ColorPicker
          :color="tweakedStepOptions.Couleur_fond"
          label="Couleur du fond"
          @update-color="updatePreview"/>
    </v-flex>
  </StepFunction>
</template>

<script>
import Draggable from '../interactions/Draggable'
import ColorPicker from '../pickers/ColorPicker'
import StepFunction from '../StepFunction'
import { mapGetters, mapState } from 'vuex'
import stepOptionsMixin from '../../stepOptionsMixin'

export default {
  name: 'TextFunction',
  extends: StepFunction,
  mixins: [stepOptionsMixin],
  computed: {
    ...mapState([
      'dimensions'
    ]),
    ...mapGetters([
      'getElementUrl',
      'displayedWidth',
      'displayedHeight'
    ]),
    textPreviewUrl () {
      const options = this.convertFromSimpleOptions(this.tweakedStepOptions || {})
      return `/viewer_myfonts/index/${options.URL}/${options.Couleur_texte}/${options.Couleur_fond}/${options.Largeur}/${options.Chaine}/${options.Demi_hauteur}/0/${this.dimensions.x}`
    },
    shownX () {
      return this.addZoom(this.tweakedStepOptions.Pos_x)
    },
    shownY () {
      return this.addZoom(this.tweakedStepOptions.Pos_y)
    },
    shownWidth () {
      return this.displayedWidth() * parseFloat(this.tweakedStepOptions.Compression_x)
    },
    shownHeight () {
      return this.displayedWidth() * parseFloat(this.tweakedStepOptions.Compression_y) / this.imageSourceRatio
    }
  },
  data: () => {
    return {
      loaded: false,
      imageSourceRatio: 1
    }
  },
  methods: {
    calculateImageRatio (ref) {
      this.imageSourceRatio = ref.naturalWidth / ref.naturalHeight
    },
    updatePreview (newValues = {}) {
      if (newValues.x !== undefined) {
        this.tweakedStepOptions.Pos_x = this.removeZoom(newValues.x)
      }
      if (newValues.w !== undefined) {
        this.tweakedStepOptions.Compression_x = newValues.w / this.displayedWidth()
      }
      if (newValues.y !== undefined) {
        this.tweakedStepOptions.Pos_y = this.removeZoom(newValues.y)
      }
      if (newValues.h !== undefined) {
        this.tweakedStepOptions.Compression_y = this.tweakedStepOptions.Compression_x * (this.imageSourceRatio / (newValues.w / newValues.h))
      }
      if (newValues.angle !== undefined) {
        this.tweakedStepOptions.Rotation = -1 * newValues.angle
      }

      this.$emit('options-changed', this.tweakedStepOptions)
    }
  },
  components: {
    StepFunction,
    Draggable,
    ColorPicker
  }
}
</script>

<style>
  label {
    display: flex;
    align-items: center;
  }
</style>
