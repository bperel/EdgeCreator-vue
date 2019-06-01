<template>
  <div>
    <Draggable
        :x="parseFloat(tweakedStepOptions.Pos_x_debut) * this.zoom"
        :y="parseFloat(tweakedStepOptions.Pos_y_debut) * this.zoom"
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
    <ColorPicker :color="tweakedStepOptions.Couleur" @update-color="updatePreview"/>
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
    canvasRef: {
      default: null
    }
  },
  computed: {
    previewBounds: function () {
      return this.canvasRef.getBoundingClientRect()
    },
    rectangleStyle: function () {
      return {
        backgroundColor: this.tweakedStepOptions.Rempli ? this.tweakedStepOptions.Couleur : 'transparent',
        outline: this.tweakedStepOptions.Rempli ? 'none' : `1px solid ${this.tweakedStepOptions.Couleur}`
      }
    },
    rectangleWidth: function () {
      return parseFloat(this.tweakedStepOptions.Pos_x_fin - this.tweakedStepOptions.Pos_x_debut) * this.zoom
    },
    rectangleHeight: function () {
      return parseFloat(this.tweakedStepOptions.Pos_y_fin - this.tweakedStepOptions.Pos_y_debut) * this.zoom
    }
  },
  data () {
    return {
      tweakedStepOptions: { ...this.options }
    }
  },
  methods: {
    updatePreview (newValues = {}) {
      if (newValues.x) {
        this.tweakedStepOptions.Pos_x_debut = parseInt(newValues.x / this.zoom)
      }
      if (newValues.width) {
        this.tweakedStepOptions.Pos_x_fin = parseInt((newValues.x + newValues.width) / this.zoom)
      }
      if (newValues.y) {
        this.tweakedStepOptions.Pos_y_debut = parseInt(newValues.y / this.zoom)
      }
      if (newValues.height) {
        this.tweakedStepOptions.Pos_y_fin = parseInt((newValues.y + newValues.height) / this.zoom)
      }
      if (newValues.color) {
        this.tweakedStepOptions.Couleur = newValues.color
      }

      this.$emit('options-changed', this.tweakedStepOptions)
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
