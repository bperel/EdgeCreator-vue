<template>
  <div class="workspace" :style="{left: `${boundX + 1}px`, top: `${boundY + 1}px`}" ref="workspace">
    <FreeTransform
        :width="shape.width"
        :height="shape.height"
        :x="shape.x"
        :y="shape.y"
        :offset-x="offsetX"
        :offset-y="offsetY"
        :scale-x="1"
        :scale-y="1"
        :angle="0"
        :disable-scale="true"
        :styles="{width: shape.width, height: shape.height}"
        @update="update(shape.id, $event)"
        @mouseup="$emit('update-position', {x: shape.x, y: shape.y})"
    >
      <div :style="getElementStyles(shape)">
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
      shape: {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      },
      offsetX: 0,
      offsetY: 0
    }
  },
  methods: {
    update (id, payload) {
      if (
        payload.x + this.width > 0 && payload.x < this.boundWidth &&
        payload.y + this.height > 0 && payload.y < this.boundHeight) {
        this.shape = {
          ...this.shape,
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
