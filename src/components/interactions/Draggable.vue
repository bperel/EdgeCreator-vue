<template>
  <div class="workspace" :style="{left: `${boundX}px`, top: `${boundY}px`}" ref="workspace">
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
        @mouseup="$emit('update-position', {x: fillPoint.x, y: fillPoint.y})"
    >
      <div :style="getElementStyles(fillPoint)">
        <slot></slot>
      </div>
    </FreeTransform>
  </div>
</template>

<script>
import FreeTransform from 'vue-free-transform'
export default {
  name: 'Draggable',
  props: {
    x: Number,
    y: Number,
    boundX: Number,
    boundY: Number,
    boundWidth: Number,
    boundHeight: Number,
    width: Number,
    height: Number
  },
  data () {
    return {
      tweakedOptions: Object.assign({}, this.options),
      crossPosition: {
        left: this.x - this.width / 2,
        top: this.y - this.height / 2
      },
      fillPoint: {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        styles: {
          background: 'linear-gradient(135deg, #0FF0B3 0%,#036ED9 100%)'
        }
      },
      offsetX: 0,
      offsetY: 0
    }
  },
  methods: {
    update (id, payload) {
      if (
        payload.x > 0 && payload.x < this.boundWidth &&
        payload.y > 0 && payload.y < this.boundHeight) {
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
    }
  },
  mounted () {
    this.offsetX = this.$refs.workspace.offsetLeft
    this.offsetY = this.$refs.workspace.offsetTop
  },
  components: {
    FreeTransform
  }
}
</script>

<style scoped>
  .workspace {
    position: fixed;
  }

  .tr-transform--active {
    cursor: move;
  }
</style>
