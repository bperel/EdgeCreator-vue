<template>
  <StepFunction>
    <template #canvas-override>
      <Draggable :scalable="true"
          :x="addZoom(tweakedStepOptions.Decalage_x)"
          :y="addZoom(tweakedStepOptions.Decalage_y)"
          :width="imageWidth"
          :height="imageHeight"
          @update-position="updatePreview">
        <img ref="image"
             v-show="loaded"
             @load="loaded = true; calculateImageRatio($refs.image)"
             :src="getElementUrl(tweakedStepOptions.Source)"
             :style="{width: `${imageWidth}px`, height: `${imageHeight}px`}"/>
      </Draggable>
    </template>
    <template #instructions>
      <ul>
        <li>Modifiez, déplacez et redimensionnez l'image incrustée.</li>
      </ul>
    </template>

    <v-flex d-flex>
      <v-text-field
          v-model="tweakedStepOptions.Source"
          label="Image utilisée"
          required
      />
      <v-dialog v-model="showImageGalleryDialog" max-width="500px">
        <v-btn slot="activator">Modifier l'image</v-btn>
        <ImageGalleryWizard
            v-if="showImageGalleryDialog"
            :type="'Source'"
            @select-image="updatePreview({source: $event}); showImageGalleryDialog = false"
        />
      </v-dialog>
    </v-flex>
  </StepFunction>
</template>

<script>
import Draggable from '../interactions/Draggable'
import StepFunction from '../StepFunction'
import { mapGetters } from 'vuex'
import ImageGalleryWizard from '../wizards/ImageGalleryWizard'

export default {
  name: 'ImageFunction',
  extends: StepFunction,
  computed: {
    ...mapGetters([
      'getElementUrl',
      'displayedWidth',
      'displayedHeight'
    ]),
    imageWidth: function () {
      return this.displayedWidth() * parseFloat(this.tweakedStepOptions.Compression_x)
    },
    imageHeight: function () {
      return this.displayedWidth() * parseFloat(this.tweakedStepOptions.Compression_y) / this.imageRatio
    }
  },
  data: () => {
    return {
      loaded: false,
      imageRatio: 1,
      showImageGalleryDialog: false
    }
  },
  methods: {
    calculateImageRatio (ref) {
      this.imageRatio = ref.naturalWidth / ref.naturalHeight
    },
    updatePreview (newValues = {}) {
      if (newValues.x) {
        this.tweakedStepOptions.Decalage_x = this.removeZoom(newValues.x)
      }
      if (newValues.width) {
        this.tweakedStepOptions.Compression_x = newValues.width / this.displayedWidth()
      }
      if (newValues.y) {
        this.tweakedStepOptions.Decalage_y = this.removeZoom(newValues.y)
      }
      if (newValues.height) {
        this.tweakedStepOptions.Pos_y_fin = this.removeZoom(newValues.y + newValues.height)
      }
      if (newValues.source) {
        this.tweakedStepOptions.Source = newValues.source
      }

      this.$emit('options-changed', this.tweakedStepOptions)
    }
  },
  mounted: () => {

  },
  components: {
    ImageGalleryWizard,
    StepFunction,
    Draggable
  }
}
</script>

<style>
  label {
    display: flex;
    align-items: center;
  }
</style>
