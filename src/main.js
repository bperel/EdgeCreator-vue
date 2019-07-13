import Vue from 'vue'

import 'es6-promise/auto'
import Vuex from 'vuex'
import storeConfig from './store-config'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import VueRouter from 'vue-router'

import App from './App.vue'
import drr from '@minogin/vue-drag-resize-rotate'

Vue.use(Vuex)

const store = new Vuex.Store(storeConfig)

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
