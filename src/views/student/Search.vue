<template>
  <v-container>
    <v-tabs v-model="tabs" @change="changeTab(tabs)">
      <v-tab v-for="(item,index) in items" :key="index">{{item.title}}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-row class="mx-3 py-3">
          <h3 style="font-size: 24px;color: #666;font-weight: 500;">相关用户</h3>
          <v-spacer></v-spacer>
          <v-btn color="orange" text @click="handleChangeTab(1)">查看更多 ></v-btn>
        </v-row>
        <v-row class="ma-2">
          <v-col v-for="(user,index) in all.userList" :key="index" cols="12" sm="4" md="3" lg="2">
            <v-card flat outlined style="width:170px;height:170px;text-align:center" hover>
              <v-card-title></v-card-title>
              <v-avatar size="100">
                <img :src="user.avatar" />
              </v-avatar>
              <v-card-text class="pa-0">
                <p class="ma-2">
                  {{user.nickname}}
                  <v-icon size="18" color="blue" v-if="user.gender==0">mdi-gender-male</v-icon>
                  <v-icon size="19" color="red" v-else-if="user.gender==1">mdi-gender-female</v-icon>
                  <v-icon size="20" color="orange" v-else>mdi-gender-male-female</v-icon>
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="mx-3 py-3">
          <h3 style="font-size: 24px;color: #666;font-weight: 500;">相关帖子</h3>
          <v-spacer></v-spacer>
          <v-btn color="orange" text @click="handleChangeTab(2)">查看更多 ></v-btn>
        </v-row>
        <v-row class="ma-2">
          <v-col cols="12" sm="6" md="6" lg="4" v-for="(post,index) in all.postList" :key="index">
            <v-lazy
              :options="{
              threshold: .5
            }"
              min-height="200"
              transition="fade-transition"
            >
              <v-card max-width="400" class="mx-auto" hover>
                <v-list-item>
                  <v-list-item-avatar color="grey">
                    <img :src="post.authorProfile.avatar" alt="John" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="headline">{{post.title}}</v-list-item-title>
                    <v-list-item-subtitle>{{post.authorProfile.nickname}}</v-list-item-subtitle>
                  </v-list-item-content>
                  <!-- <v-spacer></v-spacer> -->
                  <v-chip class="hidden-sm-and-down" color="cyan" outlined>阅读人数:{{post.readNum}}</v-chip>
                  <v-chip
                    class="ml-2"
                    style="margin-right:-17px;margin-top:-35px;"
                    small
                    label
                    v-if="post.isTop"
                    color="red"
                    text-color="white"
                  >置顶</v-chip>
                </v-list-item>
                <v-img :src="post.imageUrl" height="194" @click="toPostView(post.id)"></v-img>
                <v-card-actions>
                  <v-btn color="purple" text @click="toPostView(post.id)">READ</v-btn>
                </v-card-actions>
              </v-card>
            </v-lazy>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-card flat loading="userLoading">
          <v-row class="ma-2">
            <v-col v-for="(user,index) in userList" :key="index" cols="12" sm="4" md="3" lg="2">
              <v-card flat outlined style="width:170px;height:170px;text-align:center" hover>
                <v-card-title></v-card-title>
                <v-avatar size="100">
                  <img :src="user.avatar" />
                </v-avatar>
                <v-card-text class="pa-0">
                  <p class="ma-2">
                    {{user.nickname}}
                    <v-icon size="18" color="blue" v-if="user.gender==0">mdi-gender-male</v-icon>
                    <v-icon size="19" color="red" v-else-if="user.gender==1">mdi-gender-female</v-icon>
                    <v-icon size="20" color="orange" v-else>mdi-gender-male-female</v-icon>
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat loading="postLoading">
          <v-row class="ma-2">
            <v-col cols="12" sm="6" md="6" lg="4" v-for="(post,index) in postList" :key="index">
              <v-lazy
                :options="{
              threshold: .5
            }"
                min-height="200"
                transition="fade-transition"
              >
                <v-card max-width="400" class="mx-auto" hover>
                  <v-list-item>
                    <v-list-item-avatar color="grey">
                      <img :src="post.authorProfile.avatar" alt="John" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="headline">{{post.title}}</v-list-item-title>
                      <v-list-item-subtitle>{{post.authorProfile.nickname}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <!-- <v-spacer></v-spacer> -->
                    <v-chip class="hidden-sm-and-down" color="cyan" outlined>阅读人数:{{post.readNum}}</v-chip>
                    <v-chip
                      class="ml-2"
                      style="margin-right:-17px;margin-top:-35px;"
                      small
                      label
                      v-if="post.isTop"
                      color="red"
                      text-color="white"
                    >置顶</v-chip>
                  </v-list-item>
                  <v-img :src="post.imageUrl" height="194" @click="toPostView(post.id)"></v-img>
                  <v-card-actions>
                    <v-btn color="purple" text @click="toPostView(post.id)">READ</v-btn>
                  </v-card-actions>
                </v-card>
              </v-lazy>
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      tabs: "",
      items: [
        {
          id: "",
          title: "综合"
        },
        {
          id: "",
          title: "用户"
        },
        {
          id: "",
          title: "帖子"
        }
      ],
      all: {
        userList: [],
        postList: [],
        //是否查询过
        status: false
      },
      userLoading: false,
      userList: [],
      userPageNum: 1,
      userPageSize: 18,
      postLoading: false,
      postList: [],
      postPageNum: 1,
      postPageSize: 18
    };
  },
  computed: {
    search: {
      get() {
        return this.$store.state.search;
      },
      set(val) {
        this.$store.commit("SET_SEARCH", val);
      }
    }
  },
  methods: {
    changeTab(tabs) {
      if (tabs == 0) {
        if (!this.all.status) {
          this.searchAll(this.search);
        }
      } else if (tabs == 1) {
        this.searchUser(this.search, this.userPageNum, this.userPageSize);
      } else if (tabs == 2) {
        this.searchPost(this.search, this.postPageNum, this.postPageSize);
      }
    },
    handleChangeTab(tabs) {
      this.tabs = tabs;
    },
    toPostView(id) {
      this.$router.push({
        path: "post",
        query: {
          id: id
        }
      });
    },
    searchAll(search) {
      this.$api
        .search({
          search: search
        })
        .then(res => {
          if (res.data.code == 200) {
            this.all.status = true;
            this.all.userList = res.data.data.userPageInfo.list;
            this.all.postList = res.data.data.postPageInfo.list;
            this.all.postList.forEach(item => {
              item.show = false;
            });
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch(err => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        });
    },
    searchUser(search, pageNum, pageSize) {
      this.userLoading = true;
      this.$api
        .searchUser({
          search: search,
          pageNum: pageNum,
          pageSize: pageSize
        })
        .then(res => {
          if (res.data.code == 200) {
            this.userList = res.data.data.list;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch(err => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.userLoading = false;
        });
    },
    searchPost(search, pageNum, pageSize) {
      this.postLoading = true;
      this.$api
        .searchPost({
          search: search,
          pageNum: pageNum,
          pageSize: pageSize
        })
        .then(res => {
          if (res.data.code == 200) {
            this.postList = res.data.data.list;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch(err => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.postLoading = false;
        });
    }
  },
  watch: {
    $route(to, from) {
      if (from.path == "/search" && to.path == "/search") {
        this.$router.go(0);
      }
    }
  },
  created() {
    console.log("created");
  },
  mounted() {
    console.log("mounted");
    this.search = this.$route.query.search;
  }
};
</script>
