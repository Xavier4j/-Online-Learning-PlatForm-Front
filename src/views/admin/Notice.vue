<template>
  <v-container class="p a-10">
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- <v-btn text color="secondary"></v-btn> -->
      <v-btn outlined color="primary" to="/admin/notice/create">
        新增公告
      </v-btn>
    </v-card-actions>
    <v-simple-table style="background:none">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="font-size:15px;" class="text-left">公告名称</th>
            <th style="font-size:15px;" class="text-left">创建人</th>
            <th style="font-size:15px;" class="text-left">创建时间</th>
            <th style="font-size:15px;" class="text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(notice, index) in noticeList" :key="index">
            <td>{{ notice.title }}</td>
            <td>{{ notice.author.nickName }}</td>
            <td>
              {{ notice.createTime }}
            </td>
            <td>
              <v-icon small class="mr-2" @click="editNotice(notice.id)">
                mdi-pencil
              </v-icon>
              <v-icon small class="mr-2" @click="deleteNotice(notice.id)">
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- 分页 -->
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
    editNotice(noticeId) {
      this.$router.push({
        path: "/admin/notice/edit",
        query: {
          noticeId: noticeId,
        },
      });
    },
    deleteNotice(noticeId) {
      this.$api
        .deleteNotice({ noticeId: noticeId })
        .then((res) => {
          if (res.data.code == 200) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
            this.getNoticeList();
          } else {
            console.log("删除失败！");
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
          console.log("删除失败！");
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "删除失败，请稍后重试！",
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
  mounted() {
    this.getNoticeList();
  },
};
</script>
