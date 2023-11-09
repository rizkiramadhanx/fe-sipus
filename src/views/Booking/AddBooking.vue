<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Tambah Buku</h2>
    <div
      class="border p-4 rounded h-100 d-flex flex-column justify-content-between"
    >
      <b-form @submit.prevent="onSubmit" id="form_booking">
        <b-form-group id="code" label="Kode Buku" label-for="code">
          <b-form-input
            id="code"
            type="number"
            class="mt-1"
            placeholder="Masukan Kode Buku"
            required
            v-model="v$.code.$model"
            :state="!v$.code.$errors.length"
          ></b-form-input>
          <b-form-invalid-feedback :state="!v$.code.$errors">
            {{ v$.code.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="id_book" label="Judul Buku" label-for="id_book">
          <b-form-select
            id="id_book"
            class="select_form"
            placeholder="Masukan nama buku"
            v-model="v$.id_book.$model"
            :options="option.book.options"
            :state="!v$.id_book.$errors.length"
          >
            <template #first>
              <b-form-select-option :value="null" disabled
                >Pilih Penulis</b-form-select-option
              >
            </template></b-form-select
          >
          <b-form-invalid-feedback :state="!v$.id_book.$errors">
            {{ v$.id_book.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>

      <div class="d-flex gap-2 mt-2 justify-content-end">
        <b-button variant="danger" @click="handleReset"> Reset </b-button>
        <b-button
          :variant="!isValidForm ? 'success' : null"
          :disabled="isValidForm"
          type="submit"
          form="form_booking"
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
import { required, minLength, helpers } from "@vuelidate/validators";
import axios from "axios";

export default {
  name: "AddBooking",
  components: { Sidebar },
  setup() {
    const state = reactive({
      code: "",
      id_book: null,
    });

    const option = reactive({
      book: {
        options: [],
      },
    });

    const rules = {
      code: {
        required,
        containsPasswordRequirement: helpers.withMessage(
          () => `Must 6 digit`,
          // @ts-ignore
          (value) => {
            if (value.length === 6) return true;
          }
        ),
      },
      id_book: {
        required,
      },
    };

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
      const { code, id_book } = this.state;

      const handleSubmit = async () => {
        const response = await axios({
          url: "/booking",
          method: "post",
          data: {
            code: code,
            id_book: id_book,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.status === 200) {
          this.$toast.success("Berhasil menambah data");
          this.$router.replace("/dashboard/booking");
        }
      };

      handleSubmit().catch((err) => {
        this.$toast.error("Gagal menambah data");
      });
    },
  },
  mounted() {
    const getOptionBook = async () => {
      const response = await axios({
        method: "get",

        url: "/book",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const setToOption = response.data.data.record.map((item) => {
        return {
          value: item.id_book,
          text: item.title,
        };
      });

      this.option.book.options = setToOption;
    };

    getOptionBook();
  },
  data() {
    return {
      breadCrumbs: [
        {
          text: "Dashboard",
          href: "/dashboard",
        },
        {
          text: "Buku",
          href: "/dashboard/booking",
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
