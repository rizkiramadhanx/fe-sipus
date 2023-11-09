import axios, { type AxiosResponse } from "axios";
import { defineStore } from "pinia";

type role = "ADMIN" | "CASHIER" | "USER";

interface StateAuth {
  token?: string;
  username?: string;
  isLogin: boolean;
  role?: role;
}

export const useAuthStore = defineStore("auth", {
  state: (): StateAuth => ({
    token: localStorage.getItem("token") || undefined,
    isLogin: localStorage.getItem("isLogin") === "true" ? true : false || false,
    username: undefined,
  }),
  getters: {},
  actions: {
    async checkUser() {
      const response = await axios({
        url: '/me',
        method: 'get',
        headers: {
          Authorization: this.token,
        },
      })
        .then((response: AxiosResponse) => {
          this.username = response.data.data.name;
          this.role = response.data.data.role;
        })
        .catch((err) => {
          this.isLogin = false;
          localStorage.setItem("isLogin", "false");
          window.location.reload();
        });
    },
    setLogin() {
      this.isLogin = true;
    },
    setLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("isLogin");
      this.username = undefined;
      this.isLogin = false;
      this.token = undefined;

      window.location.reload();
    },
  },
});
