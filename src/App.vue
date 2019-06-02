<template>
  <div id="app">
    <CheckLoggedIn @retrieve-session-user="loadUser" @prompt-login="setUser(null)"/>
    <Header v-if="user" @logout="logout" />
    <LoginWizard v-if="user === null" />
    <MenuWizard v-if="user && user.username && !model" @load-model="startModelEdit"/>
    <ModelEdit v-if="user && user.username && model" />
  </div>
</template>

<script>
import Header from './components/Header'
import LoginWizard from './components/wizards/LoginWizard'
import CheckLoggedIn from './components/CheckLoggedIn'
import MenuWizard from './components/wizards/MenuWizard'
import ModelEdit from './components/ModelEdit'
import { mapMutations, mapState } from 'vuex'
const axios = require('axios')

export default {
  name: 'app',
  computed: mapState([
    'user',
    'model'
  ]),
  methods: {
    ...mapMutations([
      'setUser',
      'setModel'
    ]),
    loadUser: function (user) {
      let vm = this
      if (user && this.$route.params.modelId) {
        this.loadModel(this.$route.params.modelId).then(() => {
          vm.setUser(user)
        })
      } else {
        vm.setUser(user)
      }
    },
    startModelEdit: function (modelId) {
      this.$router.push(`/model/${modelId}`)
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

          vm.setModel({ id, countryCode, publicationTitle, issueNumber })
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
