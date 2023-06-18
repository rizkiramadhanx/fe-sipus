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
        <template #cell(action)="row">
          <div class="d-flex gap-2">
            <b-link :href="'/dashboard/borrow/' + row.item.id_borrow">
              <b-button variant="primary"> Edit </b-button>
            </b-link>
            <b-button
              variant="danger"
              @click="handleDeleteLanguage(row.item.id_borrow)"
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
  name: "borrowDashboard",
  components: { Sidebar },
  setup() {
    const state: any = reactive({
      borrow: null,
    });

    onMounted(async () => {
      const response = await axios.get("http://localhost:3000/api/v1/borrow", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      state.borrow = response.data.data;
    });

    return {
      state,
    };
  },
  methods: {
    handleDeleteLanguage(id: number) {
      const fetchDelete = async () => {
        const response = await axios.delete(
          `http://localhost:3000/api/v1/borrow/${id}`,
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
        { key: "name", label: "Peminjaman" },
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
