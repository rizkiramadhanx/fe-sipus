<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Dashboard Judul Buku</h2>
    <div class="border p-4 rounded">
      <b-link :href="'/dashboard/book/add'" class="mt-2">
        <b-button variant="success"> Tambah </b-button>
      </b-link>
      <b-table
        :items="state.allBook"
        :fields="fields"
        show-empty
        emptyText="Data Kosong"
        class="mt-2"
        v-if="state.allBook"
      >
        <template><slot name="empty-text">Data Kosong</slot></template>
        <template #cell(Category)="row">
          <div class="d-flex gap-2">
            <template v-for="category in row.item.Category.slice(0, 2)">
              <b-button size="sm">{{ category.name }}</b-button>
            </template>
            <b-button
              v-b-tooltip.hover
              :title="
                // @ts-ignore
                row.item.Category.map((e, i, row) => {
                  if (row.length === i + 1) {
                    return `${e.name}`;
                  } else {
                    return `${e.name}, `;
                  }
                })
              "
              size="sm"
            >
              <b-icon icon="question-circle-fill" aria-label="Help"></b-icon>
            </b-button>
          </div>
        </template>
        <template #cell(action)="row">
          <div class="d-flex gap-2">
            <b-link :href="'/dashboard/book/' + row.item.id_book">
              <b-button variant="primary"> Edit </b-button>
            </b-link>
            <b-button
              variant="danger"
              @click="handleDeleteLanguage(row.item.id_book)"
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
import { onMounted, onUpdated, reactive, ref } from "vue";

export default {
  name: "BookDashboard",
  components: { Sidebar },
  setup() {
    const state: any = reactive({
      allBook: null,
    });

    return {
      state,
    };
  },
  methods: {
    retriveNewData(per_page_params: number, current_page_params: number = 10) {
      const run = async () => {
        const response = await axios.get("http://localhost:3000/api/v1/book", {
          params: {
            per_page: per_page_params,
            current_page: current_page_params,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        this.state.allBook = response.data.data.record;
      };

      run();
    },
    handleDeleteLanguage(id: number) {
      const fetchDelete = async () => {
        const response = await axios.delete(
          `http://localhost:3000/api/v1/book/${id}`,
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
  data() {
    return {
      rows: null,
      perPage: 10,
      currentPage: 1,
      fields: [
        { key: "code", label: "Kode Buku" },
        { key: "title", label: "Nama Buku" },
        {
          key: "Author.fullName",
          label: "Penulis",
        },
        {
          key: "Language.name",
          label: "Bahasa",
        },
        {
          key: "Category",
          label: "Kategori",
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
          href: "#",
        },
      ],
    };
  },
  watch: {
    currentPage(newValue) {
      this.retriveNewData(this.perPage, newValue);
    },

    perPage(newValue) {
      this.retriveNewData(newValue, this.currentPage);
    },
  },
  mounted() {
    const run = async () => {
      const response = await axios.get("http://localhost:3000/api/v1/book", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      this.state.allBook = response.data.data.record;
      this.rows = response.data.data.pagination.rows;
    };
    run();
  },
};
</script>

<style scoped></style>
