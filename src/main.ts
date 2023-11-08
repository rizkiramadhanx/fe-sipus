import Vue from "vue";
import { createPinia, PiniaVuePlugin } from "pinia";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios, { Axios } from "axios";

import App from "./App.vue";
import router from "./router";

import "./assets/scss/bootstrap.scss";
import "./assets/main.css";
import VueRouter from "vue-router";

axios.defaults.baseURL = "https://be-sipus.vercel.app/";

Vue.use(PiniaVuePlugin);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);
Vue.use(Toast);

const vueInstance = new Vue({
  pinia: createPinia(),
  router,
  render: (h) => h(App),
});



vueInstance.$mount("#app");
