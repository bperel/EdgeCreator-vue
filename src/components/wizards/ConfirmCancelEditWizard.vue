<template>
  <v-dialog data-app v-model="dialog" persistent>
    <v-card>
      <form>
        <v-card-title>
          <span class="headline">Sauvegarder les changements ?</span>
        </v-card-title>
        <v-card-text>
          Vous avez modifié l'étape que vous souhaitez fermer.
          Souhaitez-vous sauvegarder ces modifications ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="$emit('save') && $emit('close-dialog')" color="blue darken-1" flat>Sauvegarder les changements</v-btn>
          <v-btn @click="$emit('cancel-edit')" color="blue darken-1" flat>Fermer l'étape sans sauvegarder</v-btn>
          <v-btn @click="$emit('close-dialog')" color="blue darken-1" flat>Revenir à l'édition d'étape</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmCancelEditWizard',
  data: function () {
    return {
      dialog: true
    }
  }
}
</script>

<style scoped>
</style>
