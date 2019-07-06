import Vue from 'vue'

import 'es6-promise/auto'
import Vuex from 'vuex'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import VueRouter from 'vue-router'

import App from './App.vue'
import drr from '@minogin/vue-drag-resize-rotate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    edgesRoot: 'http://localhost:8000/edges', // FIXME
    zoomLevels: [1, 1.5, 2, 4, 6, 8],
    user: undefined,
    zoom: 1.5,
    model: null,
    dimensions: null
  },
  mutations: {
    setUser (state, user) { state.user = user },
    setZoom (state, zoom) { state.zoom = zoom },
    setModel (state, model) { state.model = model },
    setDimensions (state, dimensions) { state.dimensions = { width: parseInt(dimensions.width), height: parseInt(dimensions.height) } }
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
      ['Edition', 'Admin'].includes(state.user.privilege)
  }
})

Vue.component('drr', drr)

Vue.use(Vuetify)

Vue.use(VueRouter)
const routes = [
  { name: 'welcome', path: '/', component: App },
  { name: 'modelEdit', path: '/model/:modelId', component: App }
]
const router = new VueRouter({
  routes
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
