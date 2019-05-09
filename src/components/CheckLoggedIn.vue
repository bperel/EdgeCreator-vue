<template>
    <div v-if="username !== undefined && !username" class="wizard" title="Session expirée">
        <p>
            Votre session a expiré.
            <br />
            Retour à la page d'accueil d'EdgeCreator.
        </p>
    </div>
</template>

<script>

export default {
  name: 'CheckLoggedIn',
  data () {
    return {
      username: undefined,
      INTERVAL_CHECK_LOGGED_IN: 5
    }
  },
  watch: {
    username: function (newValue, oldValue) {
      if (newValue !== null || oldValue === undefined) {
        this.$emit('retrieve-session-user', newValue)
      }
    }
  },
  methods: {
    check: function () {
      const axios = require('axios')
      let vm = this
      axios.post('/check_logged_in', { responseType: 'text' })
        .then(function (response) {
          vm.username = response.data || {}
        })
    }
  },
  mounted () {
    let vm = this
    setInterval(function () {
      vm.check()
    }, 1000 * 60 * vm.INTERVAL_CHECK_LOGGED_IN)
    vm.check()
  }
}
</script>
