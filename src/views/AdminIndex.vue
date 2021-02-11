<template>
  <v-app>
    <bar />

    <drawer />

    <main-view />

    <back-to-top />
  </v-app>
</template>

<script>
export default {
  name: "AdminIndex",
  components: {
    Bar: () => import("@/components/admin/Bar"),
    Drawer: () => import("@/components/admin/Drawer"),
    MainView: () => import("@/components/MainView"),
    BackToTop: () => import("@/components/BackToTop"),
  },
};
</script>
