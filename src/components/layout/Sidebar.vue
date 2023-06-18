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
        <div
          class="d-flex align-items-center avatar_navbar px-2"
          @click="toogleLogout"
        >
          <b-avatar class="mr-3"></b-avatar>
          <span class="mr-auto">{{ username }}</span>
        </div>
        <div class="hover_navigation" :class="isActiveToggle ? '' : 'd-none'">
          <b-button variant="danger" class="py-2 w-100" @click="logOut"
            >Logout</b-button
          >
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
import { ref } from "vue";
import {
  BIconBook,
  BIconPen,
  BIconTag,
  BIconPeople,
  BIconFolder,
} from "bootstrap-vue";

export default {
  name: "Sidebar",
  setup() {
    const authStore = useAuthStore();

    const { username } = authStore;

    return { username };
  },
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
      isActiveToggle: false,
      isActiveNav: true,
      items_nav: [
        {
          label: "Judul Buku",
          href: "/dashboard/book",
          role: ["ADMIN", "EMPLOYEE"],
          icon: "BIconBook",
        },
        {
          label: "Buku",
          href: "/dashboard/booking",
          role: ["ADMIN", "EMPLOYEE"],
          icon: "BIconBook",
        },
        {
          label: "Penulis",
          href: "/dashboard/author",
          role: ["ADMIN", "EMPLOYEE"],
          icon: "BIconPen",
        },
        {
          label: "Kategori",
          href: "/dashboard/category",
          role: ["ADMIN", "EMPLOYEE"],
          icon: "BIconTag",
        },
        {
          label: "Bahasa",
          href: "/dashboard/language",
          role: ["ADMIN", "EMPLOYEE"],
          icon: "BIconFolder",
        },
        {
          label: "Karyawan",
          href: "/dashboard/karyawan",
          role: ["ADMIN"],
          icon: "BIconPeople",
        },
        {
          label: "Mahasiswa",
          href: "/dashboard/student",
          role: ["ADMIN"],
          icon: "BIconPeople",
        },
        {
          label: "Peminjaman",
          href: "/dashboard/borrow",
          role: ["ADMIN"],
          icon: "BIconPeople",
        },
      ],
    };
  },
  methods: {
    toogleLogout() {
      this.isActiveToggle = !this.isActiveToggle;
    },
    logOut() {
      const authStore = useAuthStore();
      authStore.setLogout();
      window.location.reload();
    },
    toggleNav() {
      this.isActiveNav = !this.isActiveNav;
    },
    renderListNav(roleFromNav: string[]) {
      const authStore = useAuthStore();
      const { role } = authStore;
      return roleFromNav.some((record) => record === role);
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
  position: relative;
}

.hover_navigation {
  position: absolute;
  right: 2;
  top: 60px;
  padding: 10px;
  width: 210px;
  background-color: black;
  border-radius: 10px;
}
.left_sidebar {
  background-color: white;
  width: 300px;
}

a {
  text-decoration: none !important;
  color: black;
}

.avatar_navbar {
  padding: 0;
  background-color: white;
  border-radius: 10px;
}

@media (min-width: 0) and (max-width: 768px) {
  .left_sidebar {
    display: none;
  }
}
</style>
