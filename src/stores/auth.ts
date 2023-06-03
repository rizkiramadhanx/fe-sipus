import axios from "axios";
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
      const response = await axios("http://localhost:3000/api/v1/me", {
        headers: {
          Authorization: this.token,
        },
      });

      this.username = response.data.data.name;
      if (response.status === 401) {
        this.isLogin = false;
      }
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
