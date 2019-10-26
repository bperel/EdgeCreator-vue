<template>
  <v-card>
    <v-card-title>
      <span class="headline">Accueil EdgeCreator</span>
    </v-card-title>
    <v-card-text>
      <p>
        Vous êtes à présent connecté(e) sur EdgeCreator.
      </p>

      <div v-if="edgesOngoingOtherEditor.length">
        <p>
          Vos tranches en cours de conception par un autre utilisateur :
        </p>
        <v-btn-toggle>
          <EdgeModelButtonList :models="edgesOngoingOtherEditor" disabled />
        </v-btn-toggle>
      </div>
      <p>
        Que voulez-vous faire ?
      </p>
      <v-btn-toggle v-model="currentAction" class="flex-column">
        <v-btn v-for="action in availableActions" :key="action.id" left :disabled="action.disabled">
          {{ action.title }}
        </v-btn>
      </v-btn-toggle>
      <div v-if="availableActions[currentAction] && availableActions[currentAction].id === 'continue'" grid-list-md>
        <v-btn-toggle v-model="edgeToEditIndex">
          <v-container>
            <p>
              Tranches en cours de conception par vous :
            </p>
            <EdgeModelButtonList :models="edgesOngoing" />
          </v-container>
          <v-container>
            <p>
              Tranches en attente de conception :
            </p>
            <EdgeModelButtonList :models="edgesPendingForEdit" />
          </v-container>
        </v-btn-toggle>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="startModelEdit()" color="blue darken-1" text>Suivant</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import EdgeModelButtonList from '../buttons/EdgeModelButtonList'
import { mapGetters } from 'vuex'
const axios = require('axios')

export default {
  name: 'MenuWizard',
  data: () => ({
    dialog: true,
    currentAction: 3,
    actions: [
      { id: 'send', title: 'Envoyer des photos de tranche', editorsOnly: false },
      { id: 'create', title: 'Créer une tranche de magazine', editorsOnly: true },
      { id: 'modify', title: 'Modifier une tranche de magazine', editorsOnly: true, disabled: true },
      { id: 'continue', title: 'Concevoir une tranche de magazine', editorsOnly: true }
    ],
    edgesOngoing: [],
    edgesOngoingOtherEditor: [],
    edgesPendingForEdit: [],
    edgeToEditIndex: 0
  }),
  computed: {
    ...mapGetters([
      'userIsEditor'
    ]),
    availableActions: function () {
      let vm = this
      return this.actions.filter(action => !(action.editorsOnly && !vm.userIsEditor))
    }
  },
  methods: {
    startModelEdit: function () {
      this.$emit('load-model', this.edgesOngoing.concat(this.edgesPendingForEdit)[this.edgeToEditIndex].id)
    }
  },
  mounted () {
    let vm = this

    axios.get('/tranchesencours/load')
      .then(({ data }) => {
        vm.edgesOngoing = data.tranches_en_cours
        vm.edgesOngoingOtherEditor = data.tranches_en_attente
        vm.edgesPendingForEdit = data.tranches_en_attente_d_edition
      })
  },
  components: {
    EdgeModelButtonList
  }
}
</script>

<style scoped>
  .v-btn-toggle {
    flex-direction: column;
  }
</style>
