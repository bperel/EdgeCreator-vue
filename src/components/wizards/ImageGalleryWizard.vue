<template>
  <v-card :style="{'overflow-x': 'hidden'}">
    <v-card-title>
      <span class="headline">Gallerie d'images</span>
    </v-card-title>
    <v-card-text>
      <v-layout>
        <v-flex xs12>
          <v-card>
            <v-container grid-list-sm fluid>
              <v-layout row wrap>
                <v-flex
                    @click="$emit('select-image', item)"
                    class="thumbnail"
                    v-for="(item, itemIndex) in items"
                    :key="itemIndex"
                    xs4
                    d-flex
                >
                  <v-card flat tile class="d-flex">
                    <v-img
                        v-if="itemIndex <= loadingItem"
                        :src="getElementUrl(item)"
                        @load="loadingItem++"
                        @error="loadingItem++"
                        contain
                        aspect-ratio="1"
                        class="grey lighten-2"
                    >
                      <template v-slot:placeholder>
                        <v-layout
                            fill-height
                            align-center
                            justify-center
                            ma-0
                        >
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                      </template>
                    </v-img>
                  </v-card>
                  <div class="image-name">{{ item }}</div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
const axios = require('axios')

export default {
  name: 'ImageGalleryWizard',
  props: {
    type: String
  },
  data: () => {
    return {
      loadingItem: 0,
      items: []
    }
  },
  computed: {
    ...mapState([
      'model'
    ]),
    ...mapGetters([
      'getElementUrl'
    ])
  },
  mounted () {
    let vm = this
    axios.get(`/listerg/index/${this.type}/${this.model.countryCode}/${this.model.publicationCodeShort}`)
      .then(function ({ data }) {
        vm.items = data
      })
  }
}
</script>

<style scoped>
  .container {
    padding: 4px;
  }
  .thumbnail {
    flex-direction: column;
  }
  .thumbnail > * {
    cursor: pointer;
  }
  .thumbnail .image-name {
    text-align: center;
  }
</style>
