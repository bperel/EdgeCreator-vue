import Vue from 'vue'

import 'es6-promise/auto'
import Vuex from 'vuex'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import VueRouter from 'vue-router'

import App from './App.vue'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    edgesRoot: 'http://localhost:8000/edges', // FIXME
    user: undefined,
    zoom: 1.5,
    model: null,
    dimensions: null
  },
  mutations: {
    setUser (state, user) { state.user = user },
    setZoom (state, zoom) { state.zoom = zoom },
    setModel (state, model) { state.model = model },
    setDimensions (state, dimensions) { state.dimensions = dimensions }
  },
  getters: {
    getElementUrl: (state) => fileName =>
      `${state.edgesRoot}/${state.model.countryCode}/elements/${fileName}`,

    addZoom: (state) => value =>
      parseFloat(value) * state.zoom,

    removeZoom: (state) => value =>
      parseInt(value / state.zoom),

    displayedWidth: (state, getters) => () =>
      getters.addZoom(state.dimensions.width),

    displayedHeight: (state, getters) => () =>
      getters.addZoom(state.dimensions.height)
  }
})

Vue.use(Vuetify)

Vue.use(VueRouter)
const routes = [
  { path: '/', component: App },
  { path: '/model/:modelId', component: App }
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
