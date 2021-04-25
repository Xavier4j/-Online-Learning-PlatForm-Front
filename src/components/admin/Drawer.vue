<template>
  <v-navigation-drawer
    v-model="drawer"
    width="200"
    dark
    color="blue-grey darken-1"
    :clipped="$vuetify.breakpoint.lgAndUp"
    app
  >
    <template v-slot:img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
    </template>
    <v-list nav>
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.path">
            <v-list-item-icon style="margin-right:20px">
              <v-icon class="body-1" v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                class="body-2"
                v-text="item.title"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Drawer",
  props: {
    source: String,
  },
  data: () => ({
    dialog: false,
    items: [
      // { icon: "mdi-history", title: "首页", path: "/admin/home" },
      { icon: "mdi-history", title: "课程管理", path: "/admin/course" },
      { icon: "mdi-contacts", title: "知识点管理", path: "/admin/point" },
      { icon: "mdi-contacts", title: "试卷管理", path: "/admin/paper" },
      { icon: "mdi-contacts", title: "习题管理", path: "/admin/question" },
      { icon: "mdi-contacts", title: "公告管理", path: "/admin/notice" },
    ],
  }),
  computed: {
    ...mapState(["barColor", "barImage"]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
    profile() {
      return {
        avatar: true,
        title: this.$t("avatar"),
      };
    },
  },
};
</script>

<style lang="sass"></style>
