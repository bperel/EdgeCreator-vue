<template>
    <div></div>
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
      if (oldValue === undefined) {
        if (newValue === null) {
          this.$emit('prompt-login', newValue)
        } else {
          this.$emit('retrieve-session-user', newValue)
        }
      }
    }
  },
  methods: {
    check: function () {
      const axios = require('axios')
      let vm = this
      axios.post('/check_logged_in', { responseType: 'text' })
        .then(function (response) {
          vm.username = (response.data || {}).username ? response.data : null
        })
        .catch(function () {
          vm.username = null
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
