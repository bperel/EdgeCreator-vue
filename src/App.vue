<template>
  <div id="app">
    <Header :user="user" :model="model" :zoom="zoom" @logout="logout" />
    <CheckLoggedIn @retrieve-session-user="loadUser"/>
    <LoginWizard v-if="user.username === undefined" />
    <MenuWizard v-if="user.username && !model" :user="user" @set-model-id="setModelId"/>
  </div>
</template>

<script>
import Header from './components/Header'
import LoginWizard from './components/wizards/LoginWizard'
import CheckLoggedIn from './components/CheckLoggedIn'
import MenuWizard from './components/wizards/MenuWizard'

export default {
  name: 'app',
  data: function () {
    return {
      zoom: 1.5,
      user: {
        username: null
      },
      model: null
    }
  },
  methods: {
    loadUser: function (username) {
      this.user = username
    },
    setModelId: function (modelId) {
      this.model = {
        id: modelId
      }
    },
    logout: function () {
      const axios = require('axios')
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
    CheckLoggedIn
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
