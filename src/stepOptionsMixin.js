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
          if (simpleOptions[key] === 'Non') {
            simpleOptions[key] = false
          }
          if (simpleOptions[key] === 'Oui') {
            simpleOptions[key] = true
          }
        }
      }
      return simpleOptions
    },
    convertFromSimpleOptions: function (simpleOptions) {
      let options = {}
      for (let key in simpleOptions) {
        if (simpleOptions.hasOwnProperty(key)) {
          options[key] = simpleOptions[key]
          if (key.indexOf('Couleur') === 0) {
            options[key] = simpleOptions[key].replace('#', '')
          }
          if (simpleOptions[key] === true) {
            options[key] = 'Oui'
          }
          if (simpleOptions[key] === false) {
            options[key] = 'Non'
          }
        }
      }
      return options
    },
    objectToUrlParams: function (o) {
      return Object.keys(o).map(key => `${key}=${encodeURIComponent(o[key])}`).join('&') || '_'
    }
  }
}
