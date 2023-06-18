<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Edit Judul Buku</h2>
    <div
      class="border p-4 rounded h-100 d-flex flex-column justify-content-between"
    >
      <b-form @submit.prevent="onSubmit" id="form_book">
        <b-form-group id="buku" label="Nama Buku" label-for="buku">
          <b-form-input
            id="name"
            type="text"
            class="mt-1"
            placeholder="Masukan nama buku"
            required
            v-model="v$.title.$model"
            :state="!v$.title.$errors.length"
          ></b-form-input>
          <b-form-invalid-feedback :state="!v$.title.$errors">
            {{ v$.title.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="id_author" label="Nama Penulis" label-for="id_author">
          <b-form-select
            id="id_author"
            class="select_form"
            placeholder="Masukan nama buku"
            v-model="v$.id_author.$model"
            :options="option.author.options"
            :state="!v$.id_author.$errors.length"
          >
            <template #first>
              <b-form-select-option :value="null" disabled
                >Pilih Penulis</b-form-select-option
              >
            </template></b-form-select
          >
          <b-form-invalid-feedback :state="!v$.id_author.$errors">
            {{ v$.id_author.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="id_language" label="Bahasa" label-for="id_language">
          <b-form-select
            id="id_language"
            class="select_form"
            placeholder="Masukan nama buku"
            v-model="v$.id_language.$model"
            :options="option.language.options"
            :state="!v$.id_language.$errors.length"
          >
            <template #first>
              <b-form-select-option :value="null" disabled
                >Pilih Bahasa</b-form-select-option
              >
            </template></b-form-select
          >
          <b-form-invalid-feedback :state="!v$.id_language.$errors">
            {{ v$.id_language.$errors[0]?.$message }}
          </b-form-invalid-feedback>
        </b-form-group>
        <div>
          <label class="typo__label">Tagging</label>
          <multiselect
            v-model="v$.category.$model"
            tag-placeholder="Add this as new tag"
            placeholder="Search or add a tag"
            label="name"
            track-by="code"
            :options="option.category.options"
            :multiple="true"
            :taggable="true"
            open-direction="bottom"
          ></multiselect>
        </div>
      </b-form>
      <div class="d-flex gap-2 mt-2 justify-content-end">
        <b-button variant="danger" @click="handleReset"> Reset </b-button>
        <b-button
          :variant="!isValidForm ? 'success' : null"
          :disabled="isValidForm"
          type="submit"
          form="form_book"
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
import { required, minLength } from "@vuelidate/validators";
import axios from "axios";
import Multiselect from "vue-multiselect";

export default {
  name: "EditBook",
  components: { Sidebar, Multiselect },
  setup() {
    const state = reactive({
      title: "",
      id_author: null,
      id_language: null,
      category: [
        {
          code: 2,
        },
      ],
    });

    const option = reactive({
      author: {
        options: [],
      },
      language: {
        options: [],
      },
      category: {
        options: [],
      },
    });

    const rules = {
      title: { required, minLength: minLength(5) },
      id_author: {
        required,
      },
      id_language: {
        required,
      },
      category: {
        required,
      },
    };

    const v$ = useVuelidate(rules, state);

    return { state, v$, option };
  },
  computed: {
    isValidForm(): any {
      /**
       * TODO : reset form
       */
      return this.v$.$invalid;
    },
  },
  mounted() {
    const { id } = this.$route.params;

    const getDefault = async () => {
      const response = await axios.get(
        `http://localhost:3000/api/v1/book/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      this.state.id_author = response.data.data.id_author;
      this.state.id_language = response.data.data.id_language;
      this.state.title = response.data.data.title;
      this.state.category = response.data.data.Category.map((item: any) => {
        return {
          code: item.id_category,
          name: item.name,
        };
      });
    };

    const getOptionAuthor = async () => {
      const response = await axios.get(`http://localhost:3000/api/v1/author`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const setToOption = response.data.data.map((item: any) => {
        return {
          value: item.id_author,
          text: item.fullName,
        };
      });

      this.option.author.options = setToOption;
    };
    const getOptionCategory = async () => {
      const response = await axios.get(
        `http://localhost:3000/api/v1/category`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const setToOption = response.data.data.map((item: any) => {
        return {
          name: item.name,
          code: item.id_category,
        };
      });

      this.option.category.options = setToOption;
    };

    const getOptionLanguage = async () => {
      const response = await axios.get(
        `http://localhost:3000/api/v1/language`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const setToOption = response.data.data.map((item: any) => {
        return {
          value: item.id_language,
          text: item.name,
        };
      });

      this.option.language.options = setToOption;
    };

    getOptionAuthor();
    getOptionLanguage();
    getOptionCategory();
    getDefault();
  },
  methods: {
    handleReset() {
      this.v$.$reset();
    },
    onSubmit() {
      const { title, id_author, id_language, category } = this.state;

      // @ts-ignore
      const categoryData: number[] = category.map((e: any) => e.code);

      const { id } = this.$route.params;

      const handleSubmit = async () => {
        const response = await axios(
          `http://localhost:3000/api/v1/book/${id}`,
          {
            method: "put",
            data: {
              title: title,
              id_author: id_author,
              id_language: id_language,
              array_id_category: categoryData,
            },
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (response.status === 200) {
          this.$toast.success("Berhasil mengubah data");
          this.$router.replace("/dashboard/book");
        }
      };

      handleSubmit().catch((err) => {
        this.$toast.error("Gagal mengubah data");
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
          text: "Buku",
          href: "/dashboard/buku",
        },
        {
          text: "Edit",
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

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
