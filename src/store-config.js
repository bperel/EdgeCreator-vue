import Vue from 'vue'

export default {
  state: {
    edgesRoot: 'http://localhost:8000/edges', // FIXME
    zoomLevels: [1, 1.5, 2, 4, 6, 8],
    user: undefined,
    zoom: 1.5,
    model: null,
    dimensions: null,
    steps: [],
    loadingStep: null,
    editingStep: null,
    editingStepTweakedOptions: {},
    lastGenerationTimePerStep: null
  },
  mutations: {
    setUser (state, user) { state.user = user },
    setZoom (state, zoom) { state.zoom = zoom; state.loadingStep = 0 },
    setModel (state, model) { state.model = model },
    setDimensions (state, dimensions) { state.dimensions = { width: parseInt(dimensions.width), height: parseInt(dimensions.height) } },
    setSteps (state, steps) {
      state.steps = steps

      state.lastGenerationTimePerStep = { final: new Date().getTime() }
      state.steps.forEach(step => {
        Vue.set(state.lastGenerationTimePerStep, step.Ordre, new Date().getTime())
      })
    },
    setLoadingStep (state, loadingStep) { state.loadingStep = loadingStep },
    loadNextStep (state) {
      let currentStepFound = false
      let newStepFound = false
      state.steps.forEach(step => {
        if (currentStepFound && !newStepFound) {
          state.loadingStep = step.Ordre
          newStepFound = true
        }
        if (step.Ordre === state.loadingStep) {
          currentStepFound = true
        }
      })
      if (newStepFound) {
        console.debug('New step to preview : ' + state.loadingStep)
      } else {
        state.loadingStep = -1
        console.debug('Reached last step')
      }
    },
    startEditing (state, step) { state.editingStep = step },
    setEditingStepTweakedOptions (state, tweakedOptions) { state.editingStepTweakedOptions = tweakedOptions },
    updateLastPreviewGenerationTime (state, stepNumber) { state.lastGenerationTimePerStep[stepNumber] = new Date().getTime() },
    stopEditing (state) {
      state.editingStep = null
      state.editingStepTweakedOptions = {}
    }
  },
  getters: {
    getElementUrl: (state) => fileName =>
      `${state.edgesRoot}/${state.model.countryCode}/elements/${fileName}`,

    getPhotoUrl: (state) => fileName =>
      `${state.edgesRoot}/${state.model.countryCode}/photos/${fileName}`,

    addZoom: (state) => value =>
      parseFloat(value) * state.zoom,

    removeZoom: (state) => value =>
      parseInt(value / state.zoom),

    displayedWidth: (state, getters) => () =>
      getters.addZoom(state.dimensions.width),

    displayedHeight: (state, getters) => () =>
      getters.addZoom(state.dimensions.height),

    userIsEditor: (state) => () =>
      ['Edition', 'Admin'].includes(state.user.privilege),

    getLastPreviewGenerationTime: (state) => stepNumber => {
      return state.lastGenerationTimePerStep[stepNumber]
    }
  }
}
