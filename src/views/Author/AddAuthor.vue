<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Tambah Penulis</h2>
    <div
      class="border p-4 rounded h-100 d-flex flex-column justify-content-between"
    >
      <b-form @submit.prevent="onSubmit" id="form_author">
        <b-form-group id="fullName" label="Nama Lengkap" label-for="fullName">
          <b-form-input
            id="fullName"
            type="text"
            class="mt-1"
            placeholder="Masukan nama lengkap"
            required
            v-model="v$.fullName.$model"
            :state="!v$.fullName.$errors.length"
          ></b-form-input>
          <b-form-invalid-feedback :state="!v$.fullName.$errors">
            {{ v$.fullName.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>
      <div class="d-flex gap-2 mt-2 justify-content-end">
        <b-button variant="danger" @click="handleReset"> Reset </b-button>
        <b-button
          :variant="!isValidForm ? 'success' : null"
          :disabled="isValidForm"
          type="submit"
          form="form_author"
          >Tambah</b-button
        >
      </div>
    </div>
  </Sidebar>
</template>

<script >
import Sidebar from "@/components/layout/Sidebar.vue";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";

export default {
  name: "Dashboard",
  components: { Sidebar },
  setup() {
    const state = reactive({
      fullName: "",
    });

    const rules = {
      fullName: { required, minLength: minLength(5) },
    };

    const v$ = useVuelidate(rules, state);

    return { state, v$ };
  },
  computed: {
    isValidForm() {
      /**
       * TODO : reset form
       */
      return this.v$.$invalid;
    },
  },
  methods: {
    handleReset() {
      this.v$.$reset();
    },
    onSubmit() {
      const { fullName } = this.state;

      const handleSubmit = async () => {
        const response = await axios({
          url: "/author",
          method: "post",
          data: {
            fullName: fullName,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.status === 200) {
          this.$toast.success("Berhasil menambah data");
          this.$router.replace("/dashboard/author");
        }
      };

      handleSubmit().catch((err) => {
        this.$toast.error("Gagal menambah data");
      });
    },
  },
  data() {
    return {
      breadCrumbs: [
        {
          text: "Dashboard",
          href: "dashboard",
        },
        {
          text: "Tambah",
          href: "tambah",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
