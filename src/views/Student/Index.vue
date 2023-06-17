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
      student: null,
    });

    onMounted(async () => {
      const response = await axios.get("http://localhost:3000/api/v1/student", {
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
    handleDeleteLanguage(id: number) {
      const fetchDelete = async () => {
        const response = await axios.delete(
          `http://localhost:3000/api/v1/student/${id}`,
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
