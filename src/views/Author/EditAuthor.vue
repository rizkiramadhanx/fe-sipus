<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Edit Penulis</h2>
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
          >Simpan</b-button
        >
      </div>
    </div>
  </Sidebar>
</template>

<script lang="ts">
import Sidebar from "@/components/layout/Sidebar.vue";
import { onMounted, reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";

export default {
  name: "EditAuthor",
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
  mounted() {
    const { id } = this.$route.params;

    const getDefault = async () => {
      const response = await axios.get(
        `http://localhost:3000/api/v1/author/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      this.state.fullName = response.data.data.fullName;
    };

    getDefault();
  },
  computed: {
    isValidForm(): any {
      /**
       * TODO : reset form
       */
      return this.v$.$reset();
    },

    getUrl(): object {
      return this.$route;
    },
  },
  methods: {
    handleReset() {
      this.v$.$reset();
    },
    onSubmit() {
      const { fullName } = this.state;

      const handleSubmit = async () => {
        const response = await axios("http://localhost:3000/api/v1/author", {
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
          this.$router.push("/dashboard/author");
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
          text: "Edit",
          href: "tambah",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
