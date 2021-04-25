<template>
  <v-container class="p a-10">
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-simple-table style="background:none">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="font-size:15px;" class="text-left">昵称</th>
            <th style="font-size:15px;" class="text-left">分数</th>
            <th style="font-size:15px;" class="text-left">状态</th>
            <th style="font-size:15px;" class="text-left">提交时间</th>
            <th style="font-size:15px;" class="text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(paperResult, index) in paperResultList" :key="index">
            <td>{{ paperResult.writer.nickName }}</td>
            <td>
              {{ paperResult.score }}
            </td>
            <td>
              {{ paperResult.isGrade ? "已批改" : "未批改" }}
            </td>
            <td>
              {{ paperResult.answerTime }}
            </td>
            <td>
              <v-icon
                small
                class="mr-2"
                @click="grade(paperResult.writer.userId)"
              >
                mdi-pencil
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
      breadcrumbs: [
        {
          text: "试卷列表",
          disabled: false,
          exact: true,
          to: "/admin/paper",
        },
        {
          text: "学生答卷列表",
          disabled: true,
        },
      ],
      paperId: "",
      paperResultList: [],
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    getPaperResultList(paperId) {
      this.$api
        .getPaperResultList({
          paperId: paperId,
          current: this.current,
          size: this.size,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.paperResultList = res.data.data.records;
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
    grade(writerId) {
      this.$router.push({
        path: "/admin/paper/grade",
        query: {
          paperId: this.paperId,
          writerId: writerId,
        },
      });
    },
    changePage(page) {
      console.log(page);
      this.getPaperResultList(this.paperId);
    },
  },
  mounted() {
    this.paperId = this.$route.query.paperId;
    this.getPaperResultList(this.paperId);
  },
};
</script>
