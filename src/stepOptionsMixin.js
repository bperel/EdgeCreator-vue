export default {
  methods: {
    convertToSimpleOptions: function (options) {
      let simpleOptions = {}
      for (let key in options) {
        if (options.hasOwnProperty(key)) {
          simpleOptions[key] = options[key].valeur
          if (key.indexOf('Couleur') === 0) {
            simpleOptions[key] = simpleOptions[key].replace(/^([^#])/, '#$1')
          }
        }
      }
      return simpleOptions
    },
    objectToUrl: function (o) {
      return Object.keys(o).map(key => `${key}=${encodeURIComponent(o[key])}`).join('&')
    }
  }
}
