<template>
  <Sidebar :breadCrumbs="breadCrumbs">
    <!-- <b-table striped hover :items="items"></b-table> -->
  </Sidebar>
</template>

<script >
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
      items: [
        { age: 40, first_name: "Dickerson", last_name: "Macdonald" },
        { age: 21, first_name: "Larsen", last_name: "Shaw" },
        { age: 89, first_name: "Geneva", last_name: "Wilson" },
        { age: 38, first_name: "Jami", last_name: "Carney" },
      ],
    };
  },
};
</script>

<style scoped></style>
