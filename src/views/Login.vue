<template>
  <b-container fluid class="flex g-0">
    <b-row class="flex-row container_100 g-0">
      <b-col
        class="col-md-6 d-flex bg-danger justify-content-center align-items-center"
      >
        <div class="min100">
          <img
            src="@/assets/img/login.jpg"
            fluid
            class="img-fluid min100"
            alt="Responsive image"
          />
        </div>
      </b-col>
      <b-col
        class="col-md-6 col-12 d-flex justify-content-center align-items-center right_login"
      >
        <div class="w-50 d-flex flex-column">
          <h5 class="text-uppercase font-weight-bold">Login Page</h5>
          <b-form @submit.prevent="onSubmit">
            <b-form-group id="email" label="Email" label-for="email">
              <b-form-input
                id="email"
                type="email"
                class="mt-1"
                placeholder="Enter email"
                required
                v-model="v$.email.$model"
                :state="!v$.email.$errors.length"
              ></b-form-input>
              <b-form-invalid-feedback :state="!v$.email.$errors">
                {{ v$.email.$errors[0]?.$message }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="password"
              label="Password"
              class="mt-2"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                type="password"
                class="mt-1"
                v-model="v$.password.$model"
                placeholder="Masukan password"
                :state="!v$.password.$errors.length"
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="!v$.password.$errors">
                {{ v$.password.$errors[0]?.$message }}
              </b-form-invalid-feedback></b-form-group
            >
            <b-button
              class="mt-3 w-100"
              :variant="!isValidForm ? 'success' : null"
              :disabled="isValidForm"
              type="submit"
              >Login</b-button
            >
          </b-form>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { reactive } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "login",
  data() {
    return {
      isDisabled: true,
    };
  },
  setup() {
    const state = reactive({
      email: "",
      password: "",
    });

    const rules = {
      email: { required, email, minLength: minLength(7) },
      password: { required, minLength: minLength(7) },
    };

    const v$ = useVuelidate(rules, state);

    return { state, v$ };
  },
  methods: {
    onSubmit() {
      const { email, password } = this.state;
      const storeAuth = useAuthStore();
      const { setLogin } = storeAuth;

      const login = async () => {
        const response = await axios("http://localhost:3000/api/v1/login", {
          method: "post",
          data: {
            email: email,
            password: password,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("isLogin", "true");
          setLogin();
          window.location.reload();
        }
      };

      login().catch((err) => {
        this.$toast.error("Email dan password salah");
      });
    },
  },
  computed: {
    isValidForm() {
      return this.v$.$invalid;
    },
  },
};
</script>

<style lang="scss" scoped>
.container_100 {
  height: 100vh;
  padding: 0;
}

.min100 {
  max-height: 100vh;
  object-fit: cover;
  width: 100%;
}
.right_login {
  background-color: whitesmoke;
}

.form-control:focus {
  border: none;
  box-shadow: none;
}
</style>
