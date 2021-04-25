<template>
  <v-container style="min-height:600px">
    <!-- <v-card class="my-3" v-for="(notice, index) in noticeList" :key="index">
      <v-card-title class="headline">
        {{ notice.title }}
      </v-card-title>

      <v-card-subtitle>
        {{ notice.content.substring(0, 50) + "..." }}
      </v-card-subtitle>

      <v-card-actions>
        <v-btn text :to="'notice/view/' + notice.id">
          Read Now
        </v-btn>
      </v-card-actions>
    </v-card> -->

    <div v-for="(notice, index) in noticeList" :key="index">
      <v-card class="my-3 px-3 py-1" flat :to="'notice/view/' + notice.id">
        <v-row class="mt-2">
          <v-avatar color="grey" size="60px" class="mx-4">
            <v-img :src="notice.author.avatarUrl" />
          </v-avatar>
          <span style="font-size:16px">
            {{ notice.author.nickName }}
            <v-spacer></v-spacer>
            <span style="font-size:13px">
              {{ notice.createTime | DateFormat }}
            </span>
          </span>
        </v-row>
        <v-card-title class="my-1">
          {{ notice.title }}
        </v-card-title>

        <v-card-subtitle class="text-p1 pb-0">
          {{ notice.content.substring(0, 50) + "..." }}
        </v-card-subtitle>

        <v-card-actions>
          <v-spacer></v-spacer>
          <span class="mx-1">
            {{ notice.readNum + "  浏览" }}
          </span>
          <span class="mx-1">
            <v-icon class="mx-2">mdi-comment</v-icon>
            {{ notice.commentNum }}
          </span>
        </v-card-actions>
      </v-card>
      <v-divider></v-divider>
    </div>

    <div class="text-center my-3">
      <v-pagination
        v-model="current"
        :length="pages"
        total-visible="10"
        @input="changePage"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Notice",
  data() {
    return {
      noticeList: [],
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    getNoticeList() {
      this.$api
        .searchNoticeList({ current: this.current, size: this.size })
        .then((res) => {
          if (res.data.code == 200) {
            this.noticeList = res.data.data.records;
            this.pages = res.data.data.pages;
          } else {
            console.log("获取数据失败！");
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "系统异常，请稍后重试！",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    },
    changePage(page) {
      console.log(page);
      this.getNoticeList();
    },
  },
  created() {},
  mounted() {
    this.getNoticeList();
  },
};
</script>
