<template>
  <v-dialog data-app v-model="dialog" persistent max-width="500px">
    <v-card>
      <form @submit="login">
        <v-card-title>
          <span class="headline">Connexion à EdgeCreator</span>
        </v-card-title>
        <v-card-text>
          Entrez vos identifiants DucksManager habituels ci-dessous et cliquez sur "Connexion".
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="user.username" label="Pseudo" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="user.password" label="Mot de passe" type="password" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="blue darken-1" flat>Connexion</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoginWizard',
  data: () => ({
    user: {},
    dialog: true
  }),
  methods: {
    login: function (e) {
      const axios = require('axios')
      axios.post('/edgecreatorg/login', {
        user: this.user.username,
        pass: this.user.password
      })
        .then(() => {
          location.replace('/')
        })
      e.preventDefault()
    }
  }
}
</script>

<style scoped>
</style>
