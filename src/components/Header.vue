<template>
  <v-flex id="entete_page">
    <div id="zoom" :class="{invisible: !model}">
      Zoom : <span id="zoom_value">{{zoom}}</span>
      <div id="zoom_slider"></div>
    </div>
    <div v-if="model" id="action_bar"><span id="nom_complet_tranche_en_cours">{{model.label}}</span><br />
      <img class="action tip" name="home"
           title="Revenir à l'écran d'accueil de EdgeCreator" />
      <img class="action tip" name="info"
           title="Informations sur la conception de tranche avec EdgeCreator" />
      <img class="action tip" name="dimensions"
           title="Modifier les dimensions de la tranche" />
      <img class="action tip" name="photo"
           title="Insérer/Sélectionner une photo de tranche" />
      <img class="action tip" name="clone"
           title="Cloner depuis un autre modèle de tranche" />
      <img class="action tip" name="corbeille"
           title="Supprimer cette conception de tranche" />
      <img class="action tip" name="valider"
           title="Valider cette conception de tranche" />
    </div>
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #entete_page {
    position: absolute;
    display: flex;
    justify-content: space-between;
    height: 60px;
    width: 100%;
    border-bottom: 1px solid gray;
    z-index: 101;
    background-color: white;
  }

  #entete_page #action_bar {
    text-align:center;
  }

  #entete_page #action_bar img.action {
    height: 20px;
    margin-left: 10px;
    cursor: pointer;
  }

  #entete_page #status_user {
    padding-right: 5px;
  }

  #entete_page #status_user #utilisateur {
    font-size: 12px;
  }
</style>
