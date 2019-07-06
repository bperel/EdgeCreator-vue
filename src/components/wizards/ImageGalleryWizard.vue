<template>
  <v-card :style="{'overflow-x': 'hidden'}">
    <v-card-title>
      <span class="headline">Gallerie d'images</span>
    </v-card-title>
    <v-expansion-panel>
      <v-expansion-panel-content>
        <template v-slot:header>
          <v-btn @click="showUploadForm = !showUploadForm">Uploader une image</v-btn>
        </template>
        <div v-show="showUploadForm" id="select-files"></div>
      </v-expansion-panel-content>
    </v-expansion-panel>
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
                        :src="type === 'Source' ? getElementUrl(item) : getPhotoUrl(item)"
                        @load="loadingItem++"
                        @error="loadingItem++"
                        contain
                        aspect-ratio="1"
                        :class="{grey: true, 'lighten-2': true, selected: item.replace(/.+\/([^\/]+)$/, '$1') === selected}"
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

const Uppy = require('@uppy/core')
const XHRUpload = require('@uppy/xhr-upload')
const Dashboard = require('@uppy/dashboard')

require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')

export default {
  name: 'ImageGalleryWizard',
  props: {
    type: String,
    selected: String
  },
  data: () => {
    return {
      loadingItem: 0,
      showUploadForm: false,
      items: []
    }
  },
  computed: {
    ...mapState([
      'model'
    ]),
    ...mapGetters([
      'getElementUrl',
      'getPhotoUrl'
    ])
  },
  methods: {
    loadImages () {
      let vm = this
      axios.get(`/listerg/index/${this.type}/${this.model.countryCode}/${this.model.publicationCodeShort}`)
        .then(({ data }) => {
          vm.items = data
        })
    }
  },
  mounted () {
    const uppy = Uppy({
      meta: {
        photo_tranche: this.type === 'Source' ? 0 : 1,
        multiple: 0
      },
      debug: true,
      replaceTargetContent: true,
      showProgressDetails: true,
      restrictions: {
        maxFileSize: this.type === 'Source' ? 400000 : 4000000,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: [this.type === 'Source' ? 'image/png' : 'image/jpeg']
      }
    })
      .use(Dashboard, {
        target: '#select-files',
        height: 200,
        inline: true
      })
      .use(XHRUpload, {
        endpoint: '/upload_wizard',
        getResponseError (responseText) {
          return new Error(responseText)
        }
      })

    uppy.on('complete', (result) => {
      console.log('Upload complete! We’ve uploaded these files:', result.successful)
      this.loadImages()
    })

    this.loadImages()
  }
}
</script>

<style>
  .container {
    padding: 4px;
  }
  .thumbnail {
    flex-direction: column;
  }
  .thumbnail > .v-card {
    transition-duration: 0.2s;
  }
  .thumbnail > .v-card .v-image.selected {
    outline: 4px solid black;
  }
  .thumbnail > .v-card:hover {
    outline: 4px solid gray;
  }

  .thumbnail > * {
    cursor: pointer;
  }
  .thumbnail .image-name {
    text-align: center;
  }

  .uppy-Dashboard-inner {
    min-height: 200px;
  }
  .uppy-Dashboard-poweredBy {
    display: none !important;
  }
</style>
