import Vue from 'vue'

import 'es6-promise/auto'
import Vuex from 'vuex'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import VSwitch from 'v-switch-case'

import VueRouter from 'vue-router'

import App from './App.vue'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: undefined
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    }
  }
})

Vue.use(Vuetify)

Vue.use(VSwitch)

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
