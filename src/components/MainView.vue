<template>
  <v-main>
    <router-view :key="$route.fullPath" />
    <Footer />
  </v-main>
</template>

<script>
export default {
  name: "MainView",

  components: {
    Footer: () => import("./Footer"),
  },
};
</script>
