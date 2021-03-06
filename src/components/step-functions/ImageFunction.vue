<template>
  <StepFunction>
    <template #canvas-override>
      <Draggable
          :resizable="true"
          :rotatable="false"
          :x="shownX"
          :y="shownY"
          :width="shownWidth"
          :height="shownHeight"
          @update-position="updatePreview">
        <img ref="image"
             v-show="loaded"
             @load="loaded = true; calculateImageRatio($refs.image)"
             :src="getElementUrl(editingStepTweakedOptions.Source)"
             :style="{width: '100%', height: '100%'}"/>
      </Draggable>
    </template>
    <template #instructions>
      <ul>
        Modifiez, déplacez et redimensionnez l'image incrustée.
      </ul>
    </template>

    <div class="d-flex">
      <v-text-field
          v-model="editingStepTweakedOptions.Source"
          label="Image utilisée"
          required
      />
      <v-dialog v-model="showImageGalleryDialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">Modifier l'image</v-btn>
        </template>
        <ImageGalleryWizard
            v-if="showImageGalleryDialog"
            :type="'Source'"
            :selected="editingStepTweakedOptions.Source"
            @select-image="updatePreview({source: $event}); showImageGalleryDialog = false"
        />
      </v-dialog>
    </div>
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
    shownX () {
      return this.addZoom(this.editingStepTweakedOptions.Decalage_x)
    },
    shownY () {
      return this.addZoom(this.editingStepTweakedOptions.Decalage_y)
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
      imageSourceRatio: 1,
      showImageGalleryDialog: false
    }
  },
  methods: {
    calculateImageRatio (ref) {
      this.imageSourceRatio = ref.naturalWidth / ref.naturalHeight
    },
    updatePreview (newValues = {}) {
      if (newValues.x !== undefined) {
        this.editingStepTweakedOptions.Decalage_x = this.removeZoom(newValues.x)
      }
      if (newValues.w !== undefined) {
        this.editingStepTweakedOptions.Compression_x = newValues.w / this.displayedWidth()
      }
      if (newValues.y !== undefined) {
        this.editingStepTweakedOptions.Decalage_y = this.removeZoom(newValues.y)
      }
      if (newValues.h !== undefined) {
        this.editingStepTweakedOptions.Compression_y = this.editingStepTweakedOptions.Compression_x * (this.imageSourceRatio / (newValues.w / newValues.h))
      }
      if (newValues.source !== undefined) {
        this.editingStepTweakedOptions.Source = newValues.source
      }

      this.$emit('options-changed', this.editingStepTweakedOptions)
    }
  },
  components: {
    ImageGalleryWizard,
    StepFunction,
    Draggable
  }
}
</script>

<style>
  .workspace {
    position: absolute;
    margin-left: -91px;
    margin-top: 7px;
  }

  .workspace .drr.active {
    cursor: move;
  }

  label {
    display: flex;
    align-items: center;
  }
</style>
