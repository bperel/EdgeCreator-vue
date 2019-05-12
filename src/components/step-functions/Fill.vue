<template>
  <div>
    <div class="workspace" :style="{left: crossPosition.left + 'px', top: crossPosition.top + 'px'}" ref="workspace">
      <FreeTransform
          :width="fillPoint.width"
          :height="fillPoint.height"
          :x="fillPoint.x"
          :y="fillPoint.y"
          :offset-x="offsetX"
          :offset-y="offsetY"
          :scale-x="1"
          :scale-y="1"
          :angle="0"
          :disable-scale="true"
          :styles="{width: fillPoint.width, height: fillPoint.height}"
          @update="update(fillPoint.id, $event)"
          @mouseup="updatePreview"
      >
        <div :style="getElementStyles(fillPoint)">
          <img class="fill-point" src="images/cross.png" />
        </div>
      </FreeTransform>
    </div>
    <v-alert type="info" value="1">
      <ul>
        <li>Déplacez le curseur en forme de croix pour modifier le point de remplissage.</li>
        <li>Sélectionnez une couleur pour modifier la couleur de remplissage.</li>
      </ul>
    </v-alert>
  </div>
</template>

<script>
import FreeTransform from 'vue-free-transform'

export default {
  name: 'Fill.vue',
  props: {
    zoom: Number,
    options: Object,
    stepPreviewImg: {
      default: null
    }
  },
  data () {
    const CROSS_SIZE = 10
    const previewBounds = this.stepPreviewImg.getBoundingClientRect()

    return {
      tweakedOptions: Object.assign({}, this.options),
      previewBounds,
      crossPosition: {
        left: previewBounds.left - CROSS_SIZE / 2,
        top: previewBounds.top - CROSS_SIZE / 2
      },
      fillPoint: {
        x: parseFloat(this.options.Pos_x) * this.zoom,
        y: parseFloat(this.options.Pos_y) * this.zoom,
        width: CROSS_SIZE,
        height: CROSS_SIZE,
        styles: {
          background: 'linear-gradient(135deg, #0FF0B3 0%,#036ED9 100%)'
        }
      },
      offsetX: 0,
      offsetY: 0
    }
  },
  mounted () {
    this.offsetX = this.$refs.workspace.offsetLeft
    this.offsetY = this.$refs.workspace.offsetTop
  },
  methods: {
    update (id, payload) {
      if (
        payload.x > 0 && payload.x < this.previewBounds.width &&
        payload.y > 0 && payload.y < this.previewBounds.height) {
        this.fillPoint = {
          ...this.fillPoint,
          ...payload
        }
      }
    },
    getElementStyles (element) {
      return {
        width: `${element.width}px`,
        height: `${element.height}px`,
        ...(element.styles || {})
      }
    },
    updatePreview () {
      this.tweakedOptions = Object.assign(this.tweakedOptions, {
        Pos_x: parseInt(this.fillPoint.x / this.zoom),
        Pos_y: parseInt(this.fillPoint.y / this.zoom)
      })
      this.$emit('options-changed', this.tweakedOptions)
    }
  },
  components: {
    FreeTransform
  }
}
</script>

<style>
  .workspace {
    position: fixed;
  }

  ul {
    color: black;
  }

  .fill-point {
    position: absolute;
  }

  .tr-transform--active {
    cursor: move;
  }
</style>
