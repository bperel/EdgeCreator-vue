<template>
  <div id="app">
    <CheckLoggedIn @retrieve-session-user="loadUser" @prompt-login="user = null"/>
    <Header v-if="user" :user="user" :model="model" @logout="logout" @update-zoom="updateZoom" />
    <LoginWizard v-if="user === null" />
    <MenuWizard v-if="user && user.username && !model" :user="user" @load-model="startModelEdit"/>
    <ModelEdit v-if="user && user.username && model" :model="model" :zoom="zoom" />
  </div>
</template>

<script>
import Header from './components/Header'
import LoginWizard from './components/wizards/LoginWizard'
import CheckLoggedIn from './components/CheckLoggedIn'
import MenuWizard from './components/wizards/MenuWizard'
import ModelEdit from './components/ModelEdit'
const axios = require('axios')

export default {
  name: 'app',
  data: function () {
    return {
      zoom: 1.5,
      user: undefined,
      model: null
    }
  },
  methods: {
    loadUser: function (username) {
      let vm = this
      if (username && this.$route.params.modelId) {
        this.loadModel(this.$route.params.modelId)
          .then(function () {
            vm.user = username
          })
      }
    },
    startModelEdit: function (modelId) {
      this.$router.push(`/model/${modelId}`)
    },
    updateZoom: function (newZoom) {
      this.zoom = newZoom
    },
    loadModel: function (modelId) {
      let vm = this
      return axios.post(`/tranchesencours/load/${modelId}`)
        .then(function ({ data }) {
          let {
            tranches_en_cours: [{
              id,
              pays: countryCode,
              magazine_complet: publicationTitle,
              numero: issueNumber
            }]
          } = data

          vm.model = { id, countryCode, publicationTitle, issueNumber }
        })
    },
    logout: function () {
      axios.post('/edgecreatorg/logout')
        .then(function () {
          location.replace('/')
        })
    }
  },
  components: {
    MenuWizard,
    Header,
    LoginWizard,
    CheckLoggedIn,
    ModelEdit
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
