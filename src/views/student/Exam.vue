<template>
  <v-container style="min-height:600px">
    <v-card
      color="#880E4F"
      class="my-3"
      dark
      v-for="(exam, index) in examList"
      :key="index"
    >
      <v-card-title class="headline">
        {{ exam.title }}
      </v-card-title>

      <v-card-subtitle>
        {{ exam.startTime | DateFormat }} --- {{ exam.endTime | DateFormat }}
      </v-card-subtitle>

      <v-card-actions>
        <v-btn
          text
          outlined
          :to="'exam/view/' + exam.id"
          v-if="!exam.done"
          :disabled="isEffectiveDate(exam.startTime, exam.endTime) != 0"
        >
          {{ isEffectiveDate(exam.startTime, exam.endTime) | statusFilter }}
        </v-btn>
        <v-btn text outlined :to="'exam/result/' + exam.id" v-else>
          查看考试结果
        </v-btn>
      </v-card-actions>
    </v-card>
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
import { mapState } from "vuex";
import moment from "moment/moment";
export default {
  name: "Exam",
  computed: {
    ...mapState(["token"]),
  },
  data() {
    return {
      examList: [],
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    isEffectiveDate(startTime, endTime) {
      if (moment().isBefore(moment(startTime))) {
        return -1;
      } else if (moment().isAfter(moment(endTime))) {
        return 1;
      } else {
        return 0;
      }
    },
    getExamList() {
      this.$api
        .getPaperList({
          userId: this.token,
          current: this.current,
          size: this.size,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.examList = res.data.data.records;
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
      this.getExamList();
    },
  },
  created() {},
  mounted() {
    this.getExamList();
  },
  filters: {
    statusFilter(value) {
      switch (value) {
        case -1:
          return "考试未开始";
        case 0:
          return "开始考试";
        case 1:
          return "考试已结束";
      }
    },
  },
};
</script>
