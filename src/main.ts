import Vue from "vue";
import { createPinia, PiniaVuePlugin } from "pinia";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from "./App.vue";
import router from "./router";

import "./assets/scss/bootstrap.scss";
import "./assets/main.css";
import VueRouter from "vue-router";

Vue.use(PiniaVuePlugin);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);
Vue.use(Toast);

new Vue({
  pinia: createPinia(),
  router,
  render: (h) => h(App),
}).$mount("#app");
