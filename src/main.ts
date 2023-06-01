import Vue from "vue"
import { createPinia, PiniaVuePlugin } from "pinia"
import { BootstrapVue, IconsPlugin } from "bootstrap-vue"

import App from "./App.vue"
import router from "./router"

import "./assets/scss/bootstrap.scss"

Vue.use(PiniaVuePlugin)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  router,
  pinia: createPinia(),
  render: (h) => h(App),
}).$mount("#app")
