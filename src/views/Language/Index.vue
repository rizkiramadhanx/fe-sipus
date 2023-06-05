<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <hr />
    <h2 class="mt-2">Dashboard Bahasa</h2>
    <div class="border p-4 rounded h-100">
      <b-link :href="'/dashboard/language/add'" class="mt-2">
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
            <b-link :href="'/dashboard/language/' + row.item.id_language">
              <b-button variant="primary"> Edit </b-button>
            </b-link>
            <b-button
              variant="danger"
              @click="handleDeleteLanguage(row.item.id_language)"
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
  name: "LanguageDashboard",
  components: { Sidebar },
  setup() {
    const state: any = reactive({
      allLanguage: null,
    });

    onMounted(async () => {
      const response = await axios.get(
        "http://localhost:3000/api/v1/language",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
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
          `http://localhost:3000/api/v1/language/${id}`,
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
        { key: "name", label: "Bahasa" },
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
          text: "Bahasa",
          href: "/dashboard/penulis",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
