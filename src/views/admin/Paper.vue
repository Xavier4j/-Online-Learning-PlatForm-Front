<template>
  <v-container class="p a-10">
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- <v-btn text color="secondary"></v-btn> -->
      <v-btn outlined color="primary" to="/admin/paper/create">
        新增试卷
      </v-btn>
    </v-card-actions>
    <v-simple-table style="background:none">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="font-size:15px;" class="text-left">试卷名称</th>
            <th style="font-size:15px;" class="text-left">开始时间</th>
            <th style="font-size:15px;" class="text-left">结束时间</th>
            <th style="font-size:15px;" class="text-left">创建时间</th>
            <th style="font-size:15px;" class="text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(paper, index) in paperList" :key="index">
            <td>{{ paper.title }}</td>
            <td>
              {{ paper.startTime }}
            </td>
            <td>
              {{ paper.endTime }}
            </td>
            <td>
              {{ paper.createTime }}
            </td>
            <td>
              <v-icon small class="mr-2" @click="toPaperResultList(paper.id)">
                mdi-eye
              </v-icon>
              <v-icon small class="mr-2" @click="editPaper(paper.id)">
                mdi-pencil
              </v-icon>
              <v-icon small class="mr-2" @click="deletePaper(paper.id)">
                mdi-delete
              </v-icon>
              <v-icon small @click="exportResultList(paper.id)">
                mdi-export
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
  name: "Paper",
  data() {
    return {
      paperList: [],
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    getPaperList() {
      this.$api
        .getPaperList({ current: this.current, size: this.size })
        .then((res) => {
          if (res.data.code == 200) {
            this.paperList = res.data.data.records;
            this.pages = res.data.data.pages;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    },
    toPaperResultList(paperId) {
      this.$router.push({
        path: "/admin/paper/result",
        query: {
          paperId: paperId,
        },
      });
    },
    editPaper(paperId) {
      this.$router.push({
        path: "/admin/paper/edit",
        query: {
          paperId: paperId,
        },
      });
    },
    deletePaper(paperId) {
      this.$api
        .deletePaper({ paperId: paperId })
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
            this.getPaperList();
          } else {
            console.log("删除失败！");
            this.$toast({
              color: "success",
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
            color: "success",
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
    exportResultList(paperId) {
      this.$api
        .exportResultList({ paperId: paperId })
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

            var a = document.createElement("a"); // 生成一个a元素

            var event = new MouseEvent("click"); // 创建一个单击事件

            a.download = name || "photo"; // 设置图片名称

            a.href = res.data.data; // 将生成的URL设置为a.href属性

            a.dispatchEvent(event); // 触发a的单击事件
          } else {
            this.$toast({
              color: "success",
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
          console.log(err);
          this.$toast({
            color: "success",
            mode: "",
            snackbar: true,
            text: "导出失败，请稍后重试！",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {});
    },
    changePage(page) {
      console.log(page);
      this.getPaperList();
    },
  },
  mounted() {
    this.getPaperList();
  },
};
</script>
