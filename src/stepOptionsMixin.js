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
    convertFromSimpleOptions: function (options) {
      for (let key in options) {
        if (options.hasOwnProperty(key)) {
          if (key.indexOf('Couleur') === 0) {
            options[key] = options[key].replace('#', '')
          }
          if (options[key] === true) {
            options[key] = 'Oui'
          }
          if (options[key] === false) {
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
