<template>
  <v-container class="p a-10">
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- <v-btn text color="secondary"></v-btn> -->
      <v-btn outlined color="primary" to="/admin/question/create">
        新增问题
      </v-btn>
    </v-card-actions>
    <v-simple-table style="background:none">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="font-size:15px;" class="text-left">问题名称</th>
            <th style="font-size:15px;" class="text-left">题目类型</th>
            <th style="font-size:15px;" class="text-left">知识点</th>
            <th style="font-size:15px;" class="text-left">创建时间</th>
            <th style="font-size:15px;" class="text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(question, index) in questionList" :key="index">
            <td>{{ question.question.substring(0, 20) + "..." }}</td>
            <td>{{ question.type | typeFormat }}</td>
            <td>{{ question.point.point }}</td>
            <td>
              {{ question.createTime }}
            </td>
            <td>
              <v-icon small class="mr-2" @click="editItem(question.id)">
                mdi-pencil
              </v-icon>
              <!-- <v-icon small @click="deleteQuestion(question.id)">
                mdi-delete
              </v-icon> -->
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
  name: "Question",
  data() {
    return {
      questionList: [],
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    getQuestionList() {
      this.$api
        .getQuestionList({ current: this.current, size: this.size })
        .then((res) => {
          if (res.data.code == 200) {
            this.questionList = res.data.data.records;
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
    editItem(questionId) {
      this.$router.push({
        path: "/admin/question/edit",
        query: {
          questionId: questionId,
        },
      });
    },
    deleteQuestion(questionId) {
      this.$api
        .deleteQuestion({ questionId: questionId })
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
            this.getQuestionList();
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
    changePage(page) {
      console.log(page);
      this.getQuestionList();
    },
  },
  mounted() {
    this.getQuestionList();
  },
  filters: {
    typeFormat(value) {
      switch (value) {
        case 0:
          return "单选题";
        case 1:
          return "多选题";
        case 2:
          return "判断题";
        case 3:
          return "填空题";
        case 4:
          return "问答题题";
        default:
          return "";
      }
    },
  },
};
</script>
