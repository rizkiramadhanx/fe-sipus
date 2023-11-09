<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Dashboard Penulis</h2>
    <div class="border p-4 rounded h-100">
      <b-link :href="'author/add'" class="mt-2">
        <b-button variant="success"> Tambah </b-button>
      </b-link>
      <b-table
        :items="state.allAuthor"
        :fields="fields"
        class="mt-2"
        v-if="state.allAuthor"
      >
        <template #cell(action)="row">
          <div class="d-flex gap-2">
            <b-link :href="'/dashboard/author/' + row.item.id_author">
              <b-button variant="primary"> Edit </b-button>
            </b-link>
            <b-button
              variant="danger"
              @click="handleDeleteAuthor(row.item.id_author)"
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

<script >
import Sidebar from "@/components/layout/Sidebar.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";

export default {
  name: "AuthorDashboard",
  components: { Sidebar },
  setup() {
    const state = reactive({
      allAuthor: null,
    });

    onMounted(async () => {
      const response = await axios({
        method: "get",
        url: "/author",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      state.allAuthor = response.data.data.record;
    });

    return {
      state,
    };
  },
  methods: {
    retriveNewData(per_page_params, current_page_params = 10) {
      const run = async () => {
        const response = await axios({
          method: 'get',
          url: "/author",
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
    handleDeleteAuthor(id) {
      const fetchDelete = async () => {
        const response = await axios({
          method: "delete",
          url: `/author/${id}`,
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
  data() {
    return {
      rows: null,
      perPage: 10,
      currentPage: 1,
      fields: [
        { key: "fullName", label: "Nama Lengkap" },
        {
          key: "action",
          label: "Aksi",
        },
      ],
      items: [
        {
          fullName: "Sanur",
          id: 1,
          action: {
            satu: "11",
          },
        },
        {
          fullName: "Andi",
          id: 2,
          action: {
            satu: "11",
          },
        },
      ],
      breadCrumbs: [
        {
          text: "Dashboard",
          href: "/dashboard",
        },
        {
          text: "Author",
          href: "/dashboard/penulis",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
