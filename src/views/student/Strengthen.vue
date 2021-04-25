<template>
  <v-container style="min-height:600px">
    <v-card
      flat
      min-height="500"
      style="background:none"
      v-for="(wrongRecord, index) in wrongRecordList"
      :key="index"
    >
      <v-alert class="mt-2" outlined color="cyan" border="left">{{
        '根据最近错误题目所涉及知识点 "' + wrongRecord.point.point + '" 推荐'
      }}</v-alert>
      <v-row>
        <v-col
          v-for="(video, index) in wrongRecord.videoWithCourseList"
          :key="index"
          cols="6"
        >
          <v-card class="" color="#385F73" dark>
            <v-card-title class="mb-6" style="font-size:20px">
              {{ video.point }}
            </v-card-title>
            <v-card-subtitle>《{{ video.course.name }}》</v-card-subtitle>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                :to="'course/' + video.courseId + '?video=' + video.id"
              >
                开始学习！
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Strengthen",
  computed: {
    ...mapState(["token"]),
  },
  data() {
    return {
      wrongRecordList: [],
    };
  },
  methods: {
    getWrongRecordList() {
      this.$api
        .getWrongRecordList({
          userId: this.token,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.wrongRecordList = res.data.data;
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
  },
  created() {},
  mounted() {
    this.getWrongRecordList();
  },
};
</script>
