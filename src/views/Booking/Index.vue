<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Dashboard Buku</h2>
    <div class="border p-4 rounded h-100">
      <b-link :href="'booking/add'" class="mt-2">
        <b-button variant="success"> Tambah </b-button>
      </b-link>
      <b-table
        :items="state.booking"
        :fields="fields"
        class="mt-2"
        v-if="state.booking"
      >
        <template #cell(status)="row">
          <b-button
            disabled
            class="bg-primary text-center w-auto text-white rounded"
            v-show="row.item.status === true"
          >
            Terpinjam
          </b-button>
          <b-button
            disabled
            class="bg-success text-center w-auto text-white rounded"
            v-show="row.item.status === false"
          >
            Tersedia
          </b-button>
        </template>
        <template #cell(action)="row">
          <div class="d-flex gap-2">
            <b-link :href="'/dashboard/booking/' + row.item.id_booking">
              <b-button variant="primary"> Edit </b-button>
            </b-link>
            <b-button
              variant="danger"
              @click="handleDeleteAuthor(row.item.id_booking)"
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
  name: "AuthorDashboard",
  components: { Sidebar },
  setup() {
    const state = reactive({
      booking: null,
    });

    onMounted(async () => {
      const response = await axios({
        url: "/booking",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      state.booking = response.data.data;
    });

    return {
      state,
    };
  },
  methods: {
    retriveNewData(per_page_params, current_page_params = 10) {
      const run = async () => {
        const response = await axios({
          url: "/booking",
          params: {
            per_page: per_page_params,
            current_page: current_page_params,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        this.state.allBook = response.data.data.record;
        this.rows = response.data.data.pagination.rows;
      };

      run();
    },
    handleDeleteAuthor(id) {
      const fetchDelete = async () => {
        const response = await axios({
          url: `/booking/${id}`,
          method: 'delete',
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
        this.$toast.error("Gagal menghapus data", e);
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
        { key: "code", label: "Kode Buku" },
        { key: "Book.title", label: "Judul Buku" },
        {
          key: "Book.code",
          label: "Kode Judul Buku",
        },
        {
          key: "status",
          label: "Status Peminjaman",
        },
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
          text: "Buku",
          href: "/dashboard/booking",
        },
      ],
    };
  },
};
</script>
