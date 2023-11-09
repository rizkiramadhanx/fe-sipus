<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Dashboard Mahasiswa</h2>
    <div class="border p-4 rounded h-100">
      <b-link :href="'/dashboard/student/add'" class="mt-2">
        <b-button variant="success"> Tambah </b-button>
      </b-link>
      <b-table
        :items="state.student"
        :fields="fields"
        show-empty
        emptyText="Data Kosong"
        class="mt-2"
        v-if="state.student"
      >
        <template><slot name="empty-text">Data Kosong</slot></template>
        <template #cell(action)="row">
          <div class="d-flex gap-2">
            <b-link :href="'/dashboard/student/' + row.item.id_student">
              <b-button variant="primary"> Edit </b-button>
            </b-link>
            <b-button
              variant="danger"
              @click="handleDeleteLanguage(row.item.id_student)"
              >Hapus</b-button
            >
          </div>
        </template>
      </b-table>
      <div class="d-flex justify-content-end">
        <b-pagination
          class="gap-1"
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </div>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from "@/components/layout/Sidebar.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";

export default {
  name: "CategoryDashboard",
  components: { Sidebar },
  setup() {
    const state = reactive({
      student: null,
    });

    onMounted(async () => {
      const response = await axios({
        url: "/student",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      console.log("haha", response.data.data);
      state.student = response.data.data;
    });

    return {
      state,
    };
  },
  methods: {
    retriveNewData(per_page_params, current_page_params = 10) {
      const run = async () => {
        const response = await axios({
          url: "/student",
          params: {
            per_page: per_page_params,
            current_page: current_page_params,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        this.state = response.data.data.record;
        this.rows = response.data.data.pagination.rows;
      };

      run();
    },
    handleDeleteLanguage(id) {
      const fetchDelete = async () => {
        const response = await axios({
          url: `/student/${id}`,
          method: "delete",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.status === 200) {
          this.$toast.success("Berhasil menghapus data");
          setTimeout(() => window.location.reload(), 1000);
        }
      };

      fetchDelete().catch((e) => {
        this.$toast.error("Gagal menghapus data, tabel memiliki relasi lain");
      });
    },
  },
  watch: {
    currentPage(newValue) {
      this.retriveNewData(this.perPage, newValue);
    },

    perPage(newValue) {
      this.retriveNewData(newValue, this.currentPage);
    },
  },
  data() {
    return {
      rows: null,
      perPage: 10,
      currentPage: 1,
      fields: [
        { key: "NIM", label: "NIM" },
        { key: "fullName", label: "Nama" },
        { key: "phone", label: "Nomor Telp." },

        {
          key: "action",
          label: "Aksi",
        },
      ],

      breadCrumbs: [
        {
          text: "Dashboard",
          href: "/dashboard",
        },
        {
          text: "Mahasiswa",
          href: "/dashboard/student",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
