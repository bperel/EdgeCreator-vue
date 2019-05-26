<template>
  <div>
    <Draggable
        :x="parseFloat(options.Pos_x_debut) * this.zoom"
        :y="parseFloat(options.Pos_y_debut) * this.zoom"
        :width="rectangleWidth"
        :height="rectangleHeight"
        :boundX="previewBounds.left"
        :boundY="previewBounds.top"
        :boundWidth="previewBounds.width"
        :boundHeight="previewBounds.height"
        @update-position="updatePreview">
      <div class="rectangle" :style="{...rectangleStyle, width: `${rectangleWidth}px`, height: `${rectangleHeight}px`}"/>
    </Draggable>
    <v-alert outline color="blue" type="info" value="1" style="background: white">
      <ul>
        <li>Déplacez et redimensionnez le rectangle.</li>
        <li>Sélectionnez une couleur pour modifier la couleur de remplissage ou de contour.</li>
      </ul>
    </v-alert>
    <ColorPicker :color="options.Couleur" @update-color="updatePreview"/>
  </div>
</template>

<script>
import ColorPicker from '../pickers/ColorPicker'
import Draggable from '../interactions/Draggable'

export default {
  name: 'Rectangle.vue',
  props: {
    zoom: Number,
    options: Object,
    stepPreviewImg: {
      default: null
    }
  },
  computed: {
    previewBounds: function () {
      return this.stepPreviewImg.getBoundingClientRect()
    },
    rectangleStyle: function () {
      return {
        backgroundColor: this.options.Rempli ? this.options.Couleur : 'transparent',
        outline: this.options.Rempli ? 'none' : `1px solid ${this.options.Couleur}`
      }
    },
    rectangleWidth: function () {
      return parseFloat(this.options.Pos_x_fin - this.options.Pos_x_debut) * this.zoom
    },
    rectangleHeight: function () {
      return parseFloat(this.options.Pos_y_fin - this.options.Pos_y_debut) * this.zoom
    }
  },
  data () {
    return {
      tweakedOptions: { ...this.options }
    }
  },
  methods: {
    updatePreview (newValues = {}) {
      if (newValues.x) {
        this.tweakedOptions.Pos_x = parseInt(newValues.x / this.zoom)
      }
      if (newValues.y) {
        this.tweakedOptions.Pos_y = parseInt(newValues.y / this.zoom)
      }
      if (newValues.color) {
        this.tweakedOptions.Couleur = newValues.color
      }
      this.tweakedOptions.Couleur = this.tweakedOptions.Couleur.replace('#', '')

      this.$emit('options-changed', this.tweakedOptions)
    }
  },
  components: {
    ColorPicker,
    Draggable
  }
}
</script>

<style>
  ul {
    color: black;
  }

  .fill-point {
    position: absolute;
  }
</style>
