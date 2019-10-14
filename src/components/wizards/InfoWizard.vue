<template>
  <v-card>
    <v-card-title>
      <span class="headline">Concevoir une tranche avec EdgeCreator</span>
    </v-card-title>
    <v-card-text>
      Chacune des manipulations permettant de créer la tranche sont appelées des <b>étapes</b>.
      <br />
      Les étapes de votre tranche sont présentées à gauche, dans leur ordre d'utilisation.<br />
      <ul style="list-style-type: circle">
        <li>Cliquez sur une étape pour la modifier.</li>
        <li>Passez la souris entre 2 étapes pour en insérer une nouvelle.</li>
      </ul>
      <br />
      La zone "Preview" contient :
      <ul style="list-style-type: circle">
        <li>La tranche qui précède le numéro actuel, si elle existe</li>
        <li>La prévisualisation du numéro actuel</li>
        <li>La tranche qui suit le numéro actuel, si elle existe</li>
        <li>La photo de la tranche du numéro actuel, si elle existe</li>
      </ul>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="$emit('close-dialog')">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'InfoWizard',
  data: () => ({
    dialog: true
  })
}
</script>

<style scoped>
  .v-card__text {
    white-space: normal;
  }
</style>
