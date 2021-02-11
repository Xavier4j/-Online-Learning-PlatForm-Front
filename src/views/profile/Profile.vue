<template>
  <v-container>
    <v-tabs
      background-color="white"
      color="deep-purple accent-4"
      right
      show-arrows
    >
      <v-tabs-slider color="yellow"></v-tabs-slider>
      <v-tab v-for="(item, index) in tabItems" :key="index" :to="item.path">
        {{ item.title }}
      </v-tab>
    </v-tabs>

    <v-tabs-items>
      <router-view :key="$route.fullPath" />
    </v-tabs-items>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Profile",
  computed: {
    ...mapState(["role"]),
  },
  data: () => ({
    tab: "",
    tabItems: [
      { title: "个人信息", path: "/profile/info" },
      { title: "消息", path: "/profile/message" },
      { title: "账号设置", path: "/profile/account" },
    ],
  }),
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.v-text-field .v-input__control {
  display: none;
}
</style>
