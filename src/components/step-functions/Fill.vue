<template>
  <div>
    <div class="workspace" :style="{left: crossPosition.left + 'px', top: crossPosition.top + 'px'}" ref="workspace">
      <FreeTransform
          :width="element.width"
          :height="element.height"
          :x="element.x"
          :y="element.y"
          :offset-x="offsetX"
          :offset-y="offsetY"
          :scale-x="1"
          :scale-y="1"
          :angle="0"
          :disable-scale="true"
          :styles="{width: element.width, height: element.height}"
          @update="update(element.id, $event)"
      >
        <div :style="getElementStyles(element)">
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
    options: Object,
    stepPreviewImg: {
      default: null
    }
  },
  data () {
    const CROSS_SIZE = 10
    const previewBounds = this.stepPreviewImg.getBoundingClientRect()

    return {
      previewBounds,
      crossPosition: {
        left: previewBounds.left - CROSS_SIZE / 2,
        top: previewBounds.top - CROSS_SIZE / 2
      },
      element: {
        x: parseFloat(this.options.Pos_x),
        y: parseFloat(this.options.Pos_y),
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
        this.element = {
          ...this.element,
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
