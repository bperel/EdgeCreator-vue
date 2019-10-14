<template>
  <v-app id="app">
    <CheckLoggedIn @retrieve-session-user="setUser" @prompt-login="setUser(null)"/>
    <Header v-if="user" @logout="logout" />
    <LoginWizard v-if="user === null" />
    <v-dialog v-model="showMenuDialog" persistent max-width="500">
      <MenuWizard @load-model="startModelEdit"/>
    </v-dialog>
    <ModelEdit v-if="user && user.username && model" />
  </v-app>
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
  computed: {
    ...mapState([
      'user',
      'model'
    ])
  },
  watch: {
    $route: {
      immediate: true,
      handler (to) {
        if (to.params.modelId) {
          this.loadModel(to.params.modelId)
        } else {
          this.setModel(null)
        }
      }
    },
    model: {
      immediate: true,
      handler: function (newModelValue) {
        this.showMenuDialog = !newModelValue
      }
    }
  },
  data () {
    return {
      showMenuDialog: false
    }
  },
  methods: {
    ...mapMutations([
      'setUser',
      'setModel'
    ]),
    startModelEdit: function (modelId) {
      this.$router.push({ name: 'modelEdit', params: { modelId } })
    },
    loadModel: function (modelId) {
      let model
      let vm = this
      axios.post(`/tranchesencours/load/${modelId}`)
        .then(({ data: modelData }) => {
          let {
            tranches_en_cours: [{
              id,
              pays: countryCode,
              magazine: publicationCodeShort,
              magazine_complet: publicationTitle,
              numero: issueNumber
            }]
          } = modelData

          model = { id, countryCode, publicationCodeShort, publicationTitle, issueNumber }

          return axios.post('/photo_principale')
        })
        .then(({ data: photoData }) => {
          if (photoData) {
            model.photo = photoData
          }
          vm.setModel(model)
        })
    },
    logout: () => {
      axios.post('/edgecreatorg/logout')
        .then(() => {
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
