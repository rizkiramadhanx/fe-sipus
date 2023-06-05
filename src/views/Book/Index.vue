<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Dashboard Buku</h2>
    <div class="border p-4 rounded h-100">
      <b-link :href="'/dashboard/book/add'" class="mt-2">
        <b-button variant="success"> Tambah </b-button>
      </b-link>
      <b-table
        :items="state.allLanguage"
        :fields="fields"
        class="mt-2"
        v-if="state.allLanguage"
      >
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
    </div>
  </Sidebar>
</template>

<script lang="ts">
import Sidebar from "@/components/layout/Sidebar.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";

export default {
  name: "BookDashboard",
  components: { Sidebar },
  setup() {
    const state: any = reactive({
      allLanguage: null,
    });

    onMounted(async () => {
      const response = await axios.get("http://localhost:3000/api/v1/book", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      state.allLanguage = response.data.data;
    });

    return {
      state,
    };
  },
  methods: {
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
      fields: [
        { key: "name", label: "Nama Buku" },
        {
          key: "author",
          label: "Penulis",
        },
        {
          key: "language",
          label: "Bahasa",
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
};
</script>

<style scoped></style>
