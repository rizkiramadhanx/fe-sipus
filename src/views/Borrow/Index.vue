<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Dashboard Peminjaman</h2>
    <div class="border p-4 rounded h-100">
      <b-link :href="'/dashboard/borrow/add'" class="mt-2">
        <b-button variant="success"> Tambah </b-button>
      </b-link>
      <b-table
        :items="state.borrow"
        :fields="fields"
        show-empty
        emptyText="Data Kosong"
        class="mt-2"
        v-if="state.borrow"
      >
        <template><slot name="empty-text">Data Kosong</slot></template>
        <template #cell(borrow_date)="row">
          {{ formatDate(row.item.borrow_date) }}</template
        >
        <template #cell(return_date)="row">
          {{ formatDate(row.item.return_date) }}</template
        >
        <template #cell(status)="row">
          <b-button
            disabled
            class="bg-primary text-center w-auto text-white rounded"
            v-if="row.item.status === 'DIPINJAM'"
          >
            {{ row.item.status }}
          </b-button>
          <b-button
            disabled
            class="bg-success text-center w-auto text-white rounded"
            v-if="row.item.status === 'DIKEMBALIKAN'"
          >
            Dikembalikan
          </b-button>
        </template>
        <template #cell(action)="row">
          <div class="d-flex gap-2">
            <b-link :href="'/dashboard/borrow/' + row.item.id_borrow">
              <b-button variant="primary"> Edit </b-button>
            </b-link>
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
import dayjs from "dayjs";

export default {
  name: "borrowDashboard",
  components: { Sidebar },
  setup() {
    const state = reactive({
      borrow: [],
    });

    onMounted(async () => {
      const response = await axios({
        method: "get",

        url: "/borrow",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      state.borrow = response.data.data.record;
    });

    return {
      state,
    };
  },
  methods: {
    retriveNewData(per_page_params, current_page_params = 10) {
      const run = async () => {
        const response = await axios({
          method: "get",

          url: "/borrow",
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
    formatDate(date) {
      if (!date) {
        return "Belum Dikembalikan";
      }
      return dayjs(date).format("D MMMM YYYY, pukul h:mm");
    },
    handleDeleteLanguage(id) {
      const fetchDelete = async () => {
        const response = await axios({
          method: "get",

          url: `/borrow/${id}`,
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
        { key: "Booking.Book.title", label: "Judul Buku" },
        { key: "Booking.code", label: "Kode Buku" },
        { key: "borrow_date", label: "Waktu Pinjam" },
        { key: "return_date", label: "Waktu Kembali" },
        { key: "Student.fullName", label: "Nama Mahasiswa" },
        { key: "status", label: "Status Peminjaman" },
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
          text: "Peminjaman",
          href: "/dashboard/bahasa",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
