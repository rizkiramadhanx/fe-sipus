<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Edit Kategori</h2>
    <div
      class="border p-4 rounded h-100 d-flex flex-column justify-content-between"
    >
      <b-form @submit.prevent="onSubmit" id="form_category">
        <b-form-group id="name" label="Nama Kategori" label-for="name">
          <b-form-input
            id="name"
            type="text"
            class="mt-1"
            placeholder="Masukan nama bahasa"
            required
            v-model="v$.name.$model"
            :state="!v$.name.$errors.length"
          ></b-form-input>
          <b-form-invalid-feedback :state="!v$.name.$errors">
            {{ v$.name.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>
      <div class="d-flex gap-2 mt-2 justify-content-end">
        <b-button variant="danger" @click="handleReset"> Reset </b-button>
        <b-button
          :variant="!isValidForm ? 'success' : null"
          :disabled="isValidForm"
          type="submit"
          form="form_category"
          >Simpan</b-button
        >
      </div>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from "@/components/layout/Sidebar.vue";
import { onMounted, reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";

export default {
  name: "EditLanguage",
  components: { Sidebar },
  setup() {
    const state = reactive({
      name: "",
    });

    const rules = {
      name: { required, minLength: minLength(5) },
    };

    const v$ = useVuelidate(rules, state);

    return { state, v$ };
  },
  mounted() {
    const { id } = this.$route.params;

    const getDefault = async () => {
      const response = await axios({
        method: "get",

        url: `/category/${id}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      this.state.name = response.data.data.name;
    };

    getDefault();
  },
  computed: {
    isValidForm() {
      /**
       * TODO : reset form
       */
      return this.v$.$invalid;
    },

    getUrl() {
      return this.$route;
    },
  },
  methods: {
    handleReset() {
      this.v$.$reset();
    },
    onSubmit() {
      const { name } = this.state;

      const { id } = this.$route.params;

      const handleSubmit = async () => {
        const response = await axios({
          url: `category/${id}`,
          method: "put",
          data: {
            name: name,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.status === 200) {
          this.$toast.success("Berhasil menambah data");
          this.$router.push("/dashboard/category");
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
          href: "/dashboard",
        },
        {
          text: "Kategori",
          href: "/dashboard/category",
        },
        {
          text: "Edit",
          href: "tambah",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
