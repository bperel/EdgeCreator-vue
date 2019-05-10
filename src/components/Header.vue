<template>
  <v-flex justify-space-between align-center id="header">
    <div :class="{invisible: !model}">
      Zoom : <span id="zoom_value">{{zoom}}</span>
      <div id="zoom_slider"></div>
    </div>
    <v-flex v-if="model" column justify-center align-center>
      <div class="subheading text-xs-center"><img :src="'images/flags/' + model.countryCode + '.png'" />&nbsp;{{ model.publicationTitle}} n°{{ model.issueNumber }}</div>
      <div class="text-xs-center">

        <v-tooltip bottom v-for="menuItem in menuItems" :key="menuItem.icon" data-app>
          <template v-slot:activator="{ on }">
            <img v-on="on" class="action tip" :src="menuItem.icon" />
          </template>
          <span>{{ menuItem.title }}</span>
        </v-tooltip>
      </div>
    </v-flex>
    <div id="status_user">
      <v-layout column v-if="user.username">
        <div>Connecté(e) en tant que <span id="utilisateur">{{user.username}}</span></div>
        <v-btn small @click="$emit('logout')">Déconnexion</v-btn>
      </v-layout>
      <div v-else>Non connecté(e)</div>
    </div>
  </v-flex>
</template>

<script>
export default {
  name: 'Header',
  props: {
    zoom: Number,
    user: Object,
    model: Object
  },
  data () {
    return {
      menuItems: [
        {
          icon: 'images/home.png',
          title: 'Revenir à l\'écran d\'accueil de EdgeCreator'
        },
        {
          icon: 'images/info.png',
          title: 'Informations sur la conception de tranche avec EdgeCreator'
        },
        {
          icon: 'images/dimensions.png',
          title: 'Modifier les dimensions de la tranche'
        },
        {
          icon: 'images/photo.png',
          title: 'Insérer/Sélectionner une photo de tranche'
        },
        {
          icon: 'images/clone.png',
          title: 'Cloner depuis un autre modèle de tranche'
        },
        {
          icon: 'images/corbeille.png',
          title: 'Supprimer cette conception de tranche'
        },
        {
          icon: 'images/valider.png',
          title: 'Valider cette conception de tranche'
        }
      ]
    }
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

  .action {
    height: 20px;
    margin-left: 10px;
    cursor: pointer;
  }
</style>
