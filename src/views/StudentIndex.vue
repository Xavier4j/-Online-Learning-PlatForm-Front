<template>
  <v-app>
    <v-card tile>
      <v-toolbar color="#607D8B" dark flat>
        <v-toolbar-title>Java Online Course</v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- <v-text-field
          v-model="search"
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
          class="hidden-sm-and-down mr-10"
          placeholder="搜索课程"
          @change="toSearch"
          style="max-width:500px"
        /> -->

        <v-badge
          class="ma-3"
          :content="messages"
          :value="messages"
          color="green"
          overlap
        >
          <v-icon
            size="30px"
            @click="goTo('/profile/message')"
            @click.stop="setDrawer(false)"
            >mdi-email</v-icon
          >
        </v-badge>
        <v-btn class="ma-3" text v-if="!token" to="login">登录/注册</v-btn>
        <v-menu v-else offset-y transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on }">
            <v-btn class="ml-3 mr-2" icon large v-on="on">
              <v-avatar size="54px">
                <v-img :src="avatar_url" alt="请登录" />
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              @click="goTo(item.to)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab
              v-for="(item, index) in tabItems"
              v-show="index < 5 || $route.path.indexOf(item.path) >= 0"
              :key="index"
              :to="item.path"
            >
              <v-icon>{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items>
        <router-view :key="$route.fullPath" />
      </v-tabs-items>
    </v-card>

    <Footer />

    <back-to-top />
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "StudentIndex",
  components: {
    Footer: () => import("@/components/Footer"),
    BackToTop: () => import("@/components/BackToTop"),
  },
  data: () => ({
    tabItems: [
      { title: "学习", path: "/", icon: "mdi-study" },
      { title: "巩固", path: "/strengthen", icon: "mdi-strengthen" },
      { title: "测试", path: "/test", icon: "mdi-test" },
      { title: "考试", path: "/exam", icon: "mdi-exam" },
      { title: "公告", path: "/notice", icon: "mdi-communicate" },
      { title: "个人中心", path: "/profile", icon: "mdi-profile" },
      // { title: "搜索结果", path: "/search", icon: "mdi-search" },
      // { title: "课程内容", path: "/course", icon: "mdi-course" },
      // { title: "公告查看", path: "/notice/view", icon: "mdi-notice" },
      // { title: "考试内容", path: "/exam/view", icon: "mdi-exam" },
      // { title: "考试结果", path: "/exam/result", icon: "mdi-exam" },
    ],
    messages: 0,
    id_of_setinterval: "",
    items: [
      { title: "个人中心", to: "/profile/info" },
      { title: "账号设置", to: "/profile/account" },
      { title: "退出登录", to: "logout" },
    ],
  }),
  computed: {
    ...mapState(["drawer", "token", "avatar_url"]),
    search: {
      get() {
        return this.$store.state.search;
      },
      set(val) {
        this.$store.commit("SET_SEARCH", val);
      },
    },
  },
  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER",
    }),
    toSearch() {
      if (!this.search) {
        console.log("return");
        return;
      }
      this.$router
        .push({
          path: "search",
          query: {
            search: this.search,
          },
        })
        .catch(() => {});
      this.setDrawer(false);
    },
    changeTab(item) {
      console.log(item);
      this.$router.push({
        path: this.tabItems[item].path,
      });
    },
    goTo(to) {
      if (to == "logout") {
        this.$store.dispatch("LOGOUT");
        this.$router.push({
          path: "/login",
        });
      } else {
        this.setDrawer(false);
        this.$router.push({
          path: to,
        });
      }
    },
    getMessageCount() {
      console.log("getMessageCount");
      if (this.token) {
        this.$api
          .getMessageCount({
            userId: this.token,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.messages = res.data.data;
            } else {
              console.log("获取数据失败！");
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {});
      }
    },
  },
  created() {
    console.log(this.$route.fullPath);
    this.getMessageCount();
    this.id_of_setinterval = setInterval(this.getMessageCount, 1000 * 60);
  },
  beforeDestroy() {
    console.log("destory");
    clearInterval(this.id_of_setinterval);
  },
};
</script>
