<template>
  <div class="container_sidebar d-flex">
    <div class="left_sidebar border">
      <div class="p-3 border-bottom text-center">SIPUS 📚</div>
      <div class="nav_item">
        <template v-for="item in items_nav">
          <b-link
            v-bind:to="item.href"
            v-if="renderListNav(item.role)"
            class="border-bottom py-3 px-3 w-100 d-flex justify-content-center list_item_nav"
          >
            <component :is="item.icon" class="mt-1" />
            <a class="w-100 text-left mx-2">{{ item.label }} </a>
          </b-link>
        </template>
      </div>
    </div>
    <div class="right_sidebar w-100 d-flex flex-column">
      <div class="navbar shadow-md d-flex px-3 justify-content-end">
        <div class="d-flex align-items-center avatar_navbar px-2">
          <b-avatar class="mr-3"></b-avatar>
          <span class="mr-auto">J. Circlehead</span>
        </div>
      </div>
      <main class="p-3">
        <b-breadcrumb :items="breadCrumbs"></b-breadcrumb>
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from "@/stores/auth";
import {
  BIconBook,
  BIconPen,
  BIconTag,
  BIconPeople,
  BIconFolder,
} from "bootstrap-vue";

export default {
  name: "Sidebar",
  props: {
    breadCrumbs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      items: [
        {
          text: "Admin",
          href: "#",
        },
        {
          text: "Manage",
          href: "#",
        },
        {
          text: "Library",
          active: true,
        },
      ],
      isActiveNav: true,
      items_nav: [
        {
          label: "Buku",
          href: "dashboard/buku",
          role: ["ADMIN", "EMPLOYEE"],
          icon: "BIconBook",
        },

        {
          label: "Penulis",
          href: "dashboard/penulis",
          role: ["ADMIN", "EMPLOYEE"],
          icon: "BIconPen",
        },
        {
          label: "Kategori",
          href: "dashboard/kategori",
          role: ["ADMIN", "EMPLOYEE"],
          icon: "BIconTag",
        },
        {
          label: "Rak",
          href: "dashboard/rak",
          role: ["ADMIN", "EMPLOYEE"],
          icon: "BIconFolder",
        },
        {
          label: "Anggota",
          href: "dashboard/anggota",
          role: ["ADMIN", "EMPLOYEE"],
          icon: "BIconPeople",
        },
        {
          label: "Karyawan",
          href: "dashboard/karyawan",
          role: ["ADMIN"],
          icon: "BIconPeople",
        },
      ],
    };
  },
  methods: {
    toggleNav() {
      this.isActiveNav = !this.isActiveNav;
    },
    renderListNav(roleFromNav: string[]) {
      const authStore = useAuthStore();
      const { role } = authStore;
      return roleFromNav.some((record) => record === "EMPLOYEE");
    },
  },
  components: {
    BIconBook,
    BIconPen,
    BIconTag,
    BIconPeople,
    BIconFolder,
  },
};
</script>

<style scoped lang="scss">
.container_sidebar {
  min-height: 100vh;
}

.list_item_nav:hover {
  background-color: orange;
}

.sidebar {
  background-color: orange;
}
.navbar {
  background-color: beige;
}
.left_sidebar {
  background-color: white;
  width: 300px;
}

a {
  text-decoration: none !important;
  color: cadetblue;
}

.avatar_navbar {
  background-color: blue;
  padding: 0;
}

@media (min-width: 0) and (max-width: 768px) {
  .left_sidebar {
    display: none;
  }
}
</style>
