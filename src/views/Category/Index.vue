<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Dashboard Kategori</h2>
    <div class="border p-4 rounded h-100">
      <b-link :href="'/dashboard/category/add'" class="mt-2">
        <b-button variant="success"> Tambah </b-button>
      </b-link>
      <b-table
        :items="state.category"
        :fields="fields"
        show-empty
        emptyText="Data Kosong"
        class="mt-2"
        v-if="state.category"
      >
        <template><slot name="empty-text">Data Kosong</slot></template>
        <template #cell(action)="row">
          <div class="d-flex gap-2">
            <b-link :href="'/dashboard/category/' + row.item.id_category">
              <b-button variant="primary"> Edit </b-button>
            </b-link>
            <b-button
              variant="danger"
              @click="handleDeleteLanguage(row.item.id_category)"
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

<script lang="ts">
import Sidebar from "@/components/layout/Sidebar.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";

export default {
  name: "CategoryDashboard",
  components: { Sidebar },
  setup() {
    const state: any = reactive({
      category: null,
    });

    onMounted(async () => {
      const response = await axios.get(
        "http://localhost:3000/api/v1/category",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      state.category = response.data.data.record;
    });

    return {
      state,
    };
  },

  methods: {
    retriveNewData(per_page_params: number, current_page_params: number = 10) {
      const run = async () => {
        const response = await axios.get(
          "http://localhost:3000/api/v1/category",
          {
            params: {
              per_page: per_page_params,
              current_page: current_page_params,
            },
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        this.state = response.data.data.record;
        this.rows = response.data.data.pagination.rows;
      };

      run();
    },
    handleDeleteLanguage(id: number) {
      const fetchDelete = async () => {
        const response = await axios.delete(
          `http://localhost:3000/api/v1/category/${id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

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
        { key: "name", label: "Kategori" },
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
          text: "Kategori",
          href: "/dashboard/bahasa",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
