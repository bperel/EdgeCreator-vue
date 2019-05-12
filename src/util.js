const convertToSimpleOptions = function (options) {
  let simpleOptions = {}
  for (let key in options) {
    if (options.hasOwnProperty(key)) {
      simpleOptions[key] = options[key].valeur
    }
  }
  return simpleOptions
}

module.exports = {
  convertToSimpleOptions
}
