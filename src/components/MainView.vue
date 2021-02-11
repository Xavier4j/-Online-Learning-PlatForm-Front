<template>
  <v-content>
    <router-view :key="$route.fullPath" />
    <Footer />
  </v-content>
</template>

<script>
export default {
  name: "MainView",

  components: {
    Footer: () => import("./Footer"),
  },
};
</script>
