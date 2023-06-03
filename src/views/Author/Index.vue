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
    </div>
  </Sidebar>
</template>

<script lang="ts">
import Sidebar from "@/components/layout/Sidebar.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";

export default {
  name: "AuthorDashboard",
  components: { Sidebar },
  setup() {
    const state: any = reactive({
      allAuthor: null,
    });

    onMounted(async () => {
      const response = await axios.get("http://localhost:3000/api/v1/author", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      state.allAuthor = response.data.data;
    });

    return {
      state,
    };
  },
  methods: {
    handleDeleteAuthor(id: number) {
      const fetchDelete = async () => {
        const response = await axios.delete(
          `http://localhost:3000/api/v1/author/${id}`,
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
        this.$toast.error("Gagal menghapus data", e);
      });
    },
  },
  data() {
    return {
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
