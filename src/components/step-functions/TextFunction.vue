<template>
  <StepFunction>
    <template #canvas-override>
      <Draggable
          :resizable="true"
          :rotatable="true"
          :x="shownX"
          :y="shownY"
          :width="shownWidth"
          :height="shownHeight"
          :angle="-1 * editingStepTweakedOptions.Rotation"
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

    <div class="d-flex d-block flex-column">
      <v-text-field
          v-model.lazy="editingStepTweakedOptions.URL"
          @change="editingStepTweakedOptions.URL = editingStepTweakedOptions.URL.replace(/\//g, '.'); updatePreview()"
          label="Police de caractères"
          required
      />
      <v-text-field
          v-model.lazy="editingStepTweakedOptions.Chaine"
          @change="updatePreview()"
          label="Texte"
          required
      />
      <ColorPicker
          :color="editingStepTweakedOptions.Couleur_texte"
          fieldName="textColor"
          label="Couleur du texte"
          @update-color="updatePreview"/>
      <ColorPicker
          :color="editingStepTweakedOptions.Couleur_fond"
          fieldName="backgroundColor"
          label="Couleur du fond"
          @update-color="updatePreview"/>
    </div>
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
      const options = this.convertFromSimpleOptions(this.editingStepTweakedOptions || {})
      return `/viewer_myfonts/index/${options.URL}/${options.Couleur_texte}/${options.Couleur_fond}/${options.Largeur}/${options.Chaine}/${options.Demi_hauteur}/0/${this.dimensions.x}`
    },
    shownX () {
      return this.addZoom(this.editingStepTweakedOptions.Pos_x)
    },
    shownY () {
      return this.addZoom(this.editingStepTweakedOptions.Pos_y)
    },
    shownWidth () {
      return this.displayedWidth() * parseFloat(this.editingStepTweakedOptions.Compression_x)
    },
    shownHeight () {
      return this.displayedWidth() * parseFloat(this.editingStepTweakedOptions.Compression_y) / this.imageSourceRatio
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
        this.editingStepTweakedOptions.Pos_x = this.removeZoom(newValues.x)
      }
      if (newValues.w !== undefined) {
        this.editingStepTweakedOptions.Compression_x = newValues.w / this.displayedWidth()
      }
      if (newValues.y !== undefined) {
        this.editingStepTweakedOptions.Pos_y = this.removeZoom(newValues.y)
      }
      if (newValues.h !== undefined) {
        this.editingStepTweakedOptions.Compression_y = this.editingStepTweakedOptions.Compression_x * (this.imageSourceRatio / (newValues.w / newValues.h))
      }
      if (newValues.angle !== undefined) {
        this.editingStepTweakedOptions.Rotation = -1 * newValues.angle
      }
      if (newValues.backgroundColor !== undefined) {
        this.editingStepTweakedOptions.Couleur_fond = newValues.backgroundColor
      }
      if (newValues.textColor !== undefined) {
        this.editingStepTweakedOptions.Couleur_texte = newValues.textColor
      }

      this.$emit('options-changed', this.editingStepTweakedOptions)
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
