<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Tambah Mahasiswa</h2>
    <div
      class="border p-4 rounded h-100 d-flex flex-column justify-content-between"
    >
      <b-form @submit.prevent="onSubmit" id="form_student">
        <b-form-group
          id="mahasiswa"
          label="Nama Mahasiswa"
          label-for="mahasiswa"
        >
          <b-form-input
            id="name"
            type="text"
            class="mt-1"
            placeholder="Masukan nama mahasiswa"
            required
            v-model="v$.name.$model"
            :state="!v$.name.$errors.length"
          ></b-form-input>
          <b-form-invalid-feedback :state="!v$.name.$errors">
            {{ v$.name.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="NIM" label="NIM" label-for="NIM">
          <b-form-input
            id="NIM"
            type="number"
            class="mt-1"
            placeholder="Masukan NIM"
            required
            v-model="v$.NIM.$model"
            :state="!v$.NIM.$errors.length"
          ></b-form-input>
          <b-form-invalid-feedback :state="!v$.NIM.$errors">
            {{ v$.NIM.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          id="nomor telepon"
          label="Nomor Telepon"
          label-for="nomor telepon"
        >
          <b-input-group prepend="+62" class="halo">
            <b-form-input
              id="phone"
              type="number"
              placeholder="Masukan nomor telepon"
              required
              v-model="v$.phone.$model"
              :state="!v$.phone.$errors.length"
            ></b-form-input
          ></b-input-group>
          <b-form-invalid-feedback :state="!v$.phone.$errors">
            {{ v$.phone.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>
      <div class="d-flex gap-2 mt-2 justify-content-end">
        <b-button variant="danger" @click="handleReset"> Reset </b-button>
        <b-button
          :variant="!isValidForm ? 'success' : null"
          :disabled="isValidForm"
          type="submit"
          form="form_student"
          >Tambah</b-button
        >
      </div>
    </div>
  </Sidebar>
</template>

<script lang="ts">
import Sidebar from "@/components/layout/Sidebar.vue";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, integer, alpha } from "@vuelidate/validators";
import axios from "axios";

export default {
  name: "AddStudent",
  components: { Sidebar },
  setup() {
    const state = reactive({
      name: "",
      NIM: "",
      phone: "",
    });

    const rules = {
      name: { required, minLength: minLength(5) },
      NIM: { required, minLength: minLength(9), integer },
      phone: { required, minLength: minLength(8), integer },
    };

    const v$ = useVuelidate(rules, state);

    return { state, v$ };
  },
  computed: {
    isValidForm(): any {
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
      const { name, phone, NIM } = this.state;

      const handleSubmit = async () => {
        const response = await axios("http://localhost:3000/api/v1/student", {
          method: "post",
          data: {
            fullName: name,
            phone: "0" + phone,
            NIM: NIM,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.status === 200) {
          this.$toast.success("Berhasil menambah data");
          this.$router.replace("/dashboard/student");
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
          text: "Mahasiswa",
          href: "/dashboard/mahasiswa",
        },
        {
          text: "Tambah",
          href: "#",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
