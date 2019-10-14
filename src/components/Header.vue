<template>
  <div class="d-flex justify-space-between align-center" id="header">
    <v-dialog v-model="showInfoDialog" max-width="500px">
      <InfoWizard @close-dialog="showInfoDialog=false"/>
    </v-dialog>
    <v-dialog v-if="model" v-model="showDimensionsDialog" max-width="500px">
      <DimensionsWizard @close-dialog="showDimensionsDialog=false"/>
    </v-dialog>
    <v-dialog v-if="model" v-model="showImageGalleryDialog" max-width="500px">
      <ImageGalleryWizard
        :type="'Photos'"
        :selected="model.photo"
        @select-image="updatePhoto($event); showImageGalleryDialog = false"
      />
    </v-dialog>

    <div :class="{invisible: !model || zoomKey === null}">
      <div class="d-flex align-center zoom-wrapper">
        <v-label>Zoom :</v-label>
        <v-slider
            data-app
            v-model="zoomKey"
            @change="setZoom(zoomLevels[zoomKey])"
            :tick-labels="zoomLevels"
            :max="zoomLevels.length - 1"
            ticks="always"
            tick-size="6"
            color="grey"
        ></v-slider>
      </div>
    </div>
    <div v-if="model" class="flex-column justify-center align-center">
      <div class="subheading d-flex justify-center align-center">
        <img :src="`images/flags/${model.countryCode}.png`" />&nbsp;
        {{ model.publicationTitle}} n°{{ model.issueNumber }}
      </div>
      <div class="d-flex justify-space-between">
        <v-tooltip bottom v-for="menuItem in menuItems" :key="menuItem.icon" data-app>
          <template v-slot:activator="{ on }">
            <img v-on="on" class="action tip" :class="{'disabled': !!menuItem.disabled}" :src="menuItem.icon" @click="menuItem.click"/>
          </template>
          <span>{{ menuItem.title }}</span>
        </v-tooltip>
      </div>
    </div>
    <div id="status_user">
      <v-layout column v-if="user.username">
        <div>Connecté(e) en tant que <span id="utilisateur">{{user.username}}</span></div>
        <v-btn small @click="$emit('logout')">Déconnexion</v-btn>
      </v-layout>
      <div v-else>Non connecté(e)</div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import InfoWizard from './wizards/InfoWizard'
import DimensionsWizard from './wizards/DimensionsWizard'
import ImageGalleryWizard from './wizards/ImageGalleryWizard'
const axios = require('axios')

export default {
  name: 'Header',
  data () {
    return {
      zoomKey: null,
      showInfoDialog: false,
      showDimensionsDialog: false,
      showImageGalleryDialog: false,
      menuItems: [
        {
          icon: 'images/home.png',
          title: "Revenir à l'écran d'accueil de EdgeCreator",
          click: () => { this.$router.push({ name: 'welcome' }) }
        },
        {
          icon: 'images/info.png',
          title: 'Informations sur la conception de tranche avec EdgeCreator',
          click: () => { this.showInfoDialog = true }
        },
        {
          icon: 'images/dimensions.png',
          title: 'Modifier les dimensions de la tranche',
          click: () => { this.showDimensionsDialog = true }
        },
        {
          icon: 'images/photo.png',
          title: 'Insérer/Sélectionner une photo de tranche',
          click: () => { this.showImageGalleryDialog = true }
        },
        {
          icon: 'images/clone.png',
          title: 'Cloner depuis un autre modèle de tranche',
          click: () => {},
          disabled: true
        },
        {
          icon: 'images/corbeille.png',
          title: 'Supprimer cette conception de tranche',
          click: () => {},
          disabled: true
        },
        {
          icon: 'images/valider.png',
          title: 'Valider cette conception de tranche',
          click: () => {},
          disabled: true
        }
      ]
    }
  },
  computed: mapState([
    'model',
    'user',
    'zoom',
    'zoomLevels'
  ]),
  methods: {
    ...mapMutations([
      'setZoom',
      'setModel'
    ]),
    updatePhoto: function (photoName) {
      let vm = this
      axios.post(`/update_photo/index/${photoName}`).then(() => {
        let model = vm.model
        model.photo = photoName
        vm.setModel(model)
      })
    }
  },
  mounted () {
    this.zoomKey = this.zoomLevels.indexOf(this.zoom)
  },
  components: {
    InfoWizard,
    DimensionsWizard,
    ImageGalleryWizard
  }
}
</script>

<style scoped>
  #header {
    position: absolute;
    display: flex;
    height: 60px;
    width: 100%;
    border-bottom: 1px solid gray;
    z-index: 101;
    background-color: white;
  }

  .subheading {
    margin: 10px;
    height: 10px;
  }

  .zoom-wrapper {
    display: flex;
    width: 250px;
    padding: 5px;
  }

  .zoom-wrapper .v-label {
    padding: 8px;
    margin-top: -10px;
  }

  .action {
    height: 20px;
    margin-left: 10px;
    cursor: pointer;
  }

  .action.disabled {
    cursor: default;
    background-color: #ccc;
  }
</style>
