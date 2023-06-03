<template>
  <Sidebar :breadCrumbs="breadCrumbs"></Sidebar>
</template>

<script lang="ts">
import Sidebar from "@/components/layout/Sidebar.vue";

export default {
  name: "Dashboard",
  components: { Sidebar },
  data() {
    return {
      breadCrumbs: [
        {
          text: "Dashboard",
          href: "dashboard",
        },
        {
          text: "Main",
          href: "main",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
