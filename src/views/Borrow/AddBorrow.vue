<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Tambah Peminjaman</h2>
    <div
      class="border p-4 rounded h-100 d-flex flex-column justify-content-between"
    >
      <b-form @submit.prevent="onSubmit" id="form_borrow">
        <b-form-group id="id_student" label="Mahasiswa" label-for="id_student">
          <b-form-select
            id="id_student"
            class="select_form"
            placeholder="Masukan Kode Buku"
            v-model="v$.id_student.$model"
            :options="option.student.options"
            :state="!v$.id_student.$errors.length"
          >
            <template #first>
              <b-form-select-option :value="null" disabled
                >Pilih Mahasiwa</b-form-select-option
              >
            </template></b-form-select
          >
          <b-form-invalid-feedback :state="!v$.id_booking.$errors">
            {{ v$.id_booking.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="id_booking" label="Kode Buku" label-for="id_booking">
          <b-form-select
            id="id_booking"
            class="select_form"
            placeholder="Masukan nama buku"
            v-model="v$.id_booking.$model"
            :options="option.booking.options"
            :state="!v$.id_booking.$errors.length"
          >
            <template #first>
              <b-form-select-option :value="null" disabled
                >Pilih Kode Buku</b-form-select-option
              >
            </template></b-form-select
          >
          <b-form-invalid-feedback :state="!v$.id_booking.$errors">
            {{ v$.id_booking.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>
      <div class="d-flex gap-2 mt-2 justify-content-end">
        <b-button variant="danger" @click="handleReset"> Reset </b-button>
        <b-button
          :variant="!isValidForm ? 'success' : null"
          :disabled="isValidForm"
          type="submit"
          form="form_borrow"
          >Tambah</b-button
        >
      </div>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from "@/components/layout/Sidebar.vue";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import axios from "axios";

export default {
  name: "AddBorrow",
  components: { Sidebar },
  setup() {
    const state = reactive({
      id_student: null,
      id_booking: null,
    });

    const rules = {
      id_student: { required },
      id_booking: { required },
    };

    const option = reactive({
      booking: {
        options: [],
      },
      student: {
        options: [],
      },
    });

    const v$ = useVuelidate(rules, state);

    return { state, v$, option };
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
      const { id_student, id_booking } = this.state;

      const handleSubmit = async () => {
        const response = await axios({
          url: "/borrow",
          method: "post",
          data: {
            id_student: id_student,
            id_booking: id_booking,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.status === 200) {
          this.$toast.success("Berhasil menambah data");
          this.$router.replace("/dashboard/borrow");
        }
      };

      handleSubmit().catch((err) => {
        this.$toast.error("Gagal menambah data", err);
      });
    },
  },
  mounted() {
    const getBooking = async () => {
      const response = await axios({
        url: "/booking",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: {
          status: false,
        },
      });
      const setToOption = response.data.data.map((item) => {
        return {
          value: item.id_booking,
          text: item.code + ` (${item.Book.title})`,
        };
      });

      this.option.booking.options = setToOption;
    };

    const getStudent = async () => {
      const response = await axios({
        url: "/student",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const setToOption = response.data.data.map((item) => {
        return {
          value: item.id_student,
          text: item.fullName,
        };
      });

      this.option.student.options = setToOption;
    };

    getBooking();
    getStudent();
  },
  data() {
    return {
      breadCrumbs: [
        {
          text: "Dashboard",
          href: "/dashboard",
        },
        {
          text: "Peminjaman",
          href: "/dashboard/borrow",
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

<style scoped>
.select_form {
  padding: 6px 8px;
  border-radius: 5px;
  border-color: #9f9f9f;
  margin-top: 4px;
  width: 100%;
}
</style>
