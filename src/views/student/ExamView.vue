<template>
  <v-container min-height="600px" :loading="contentLoading">
    <v-row class="mx-2 my-2">
      <p style="font-size: 20px; word-wrap: break-word; margin: 15px 0">
        {{ exam.title }}
      </p>
      <v-spacer></v-spacer>
      <v-chip color="cyan" outlined>{{ time }}</v-chip>
    </v-row>
    <v-divider></v-divider>
    <v-card
      class="my-3 px-3 pt-2"
      style="background: none"
      flat
      v-for="(question, index) in exam.questionList"
      :key="index"
      elevation="2"
    >
      <div class="pt-2 px-6" v-html="question.question"></div>
      <v-card-actions class="px-6">
        <v-row class="px-2" v-if="question.type === 0">
          <v-radio-group v-model="question.answer" label="答案" row>
            <v-radio
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              :label="option"
              :value="String.fromCharCode(optionIndex + 65)"
            ></v-radio>
          </v-radio-group>
        </v-row>
        <v-row class="px-2" v-if="question.type === 1">
          <v-checkbox
            v-model="question.answer"
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            :label="option"
            :value="String.fromCharCode(optionIndex + 65)"
          ></v-checkbox>
        </v-row>

        <v-radio-group
          v-if="question.type === 2"
          v-model="question.answer"
          label="答案"
          row
        >
          <v-radio color="red" label="错误" value="false"></v-radio>
          <v-radio color="success" label="正确" value="true"></v-radio>
        </v-radio-group>
        <div class="px-2" v-if="question.type === 3">
          <v-subheader class="mb-2" style="margin-left:-20px">答案</v-subheader>
          <v-row v-for="answerIndex in question.blankNum" :key="answerIndex">
            <v-text-field
              v-model="question.answer[answerIndex - 1]"
              clearable
              outlined
              prepend-inner-icon="mdi-lightbulb-on-outline"
              :label="'空白处' + answerIndex"
              required
              style="display:inline-flex;vertical-align: sub;"
            ></v-text-field>
          </v-row>
        </div>
        <v-textarea
          ref="textarea"
          v-model="question.answer"
          v-if="question.type === 4"
          label="答案"
          auto-grow
          outlined
          row-height="25"
        ></v-textarea>
      </v-card-actions>
    </v-card>
    <div class="my-5" style="text-align:center">
      <v-btn color="primary" @click="handIn">
        提交
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import "mavon-editor/dist/highlightjs/highlight.min.js";
import moment from "moment/moment";
import Vue from "vue";
// use
Vue.use(mavonEditor);

export default {
  name: "ExamView",
  computed: {
    ...mapState(["token"]),
  },
  data() {
    return {
      contentLoading: false,
      time: "",
      flag: false,
      exam: {
        author: {
          nickName: "",
        },
      },
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
    getExam(id) {
      this.contentLoading = true;
      this.$api
        .getPaper({ paperId: id })
        .then((res) => {
          if (res.data.code == 200) {
            this.exam = res.data.data;

            var md = mavonEditor.markdownIt;
            for (const question of this.exam.questionList) {
              if (question.type == 0 || question.type == 1) {
                question.options = question.options.split(",");
              }

              if (question.type == 1) {
                question.answer = [];
              }

              if (question.type == 3) {
                question.answer = [];
                for (let index = 0; index < question.blankNum; index++) {
                  question.answer.push("");
                }
              }

              question.question = md.render(question.question);
            }
            if (
              this.isEffectiveDate(this.exam.startTime, this.exam.endTime) == 0
            ) {
              this.startTimeDown();
            } else {
              this.$toast({
                color: "error",
                mode: "",
                snackbar: true,
                text: "考试已经结束",
                timeout: 2000,
                x: "right",
                y: "top",
              });
              this.$router.push("/exam");
            }
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
            this.contentLoading = false;
          }, 200);
        });
    },
    handIn() {
      this.contentLoading = true;
      var answer = {
        answerList: [],
      };
      var questionListClone = JSON.parse(
        JSON.stringify(this.exam.questionList)
      );
      for (const question of questionListClone) {
        if (question.type == 1 || question.type == 3) {
          question.answer = question.answer.join(",");
        }
        answer.answerList.push({
          paperId: this.$route.params.id,
          writerId: this.token,
          questionId: question.id,
          answer: question.answer,
        });
      }
      this.$api
        .releaseAnswerList(answer)
        .then((res) => {
          if (res.data.code == 200) {
            this.$router.push("/exam");
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
            this.contentLoading = false;
          }, 200);
        });
    },
    startTimeDown() {
      let time = setInterval(() => {
        if (this.flag == true) {
          clearInterval(time);
        }
        this.timeDown();
      }, 500);
    },
    timeDown() {
      const endTime = new Date(this.exam.endTime);
      const nowTime = new Date();
      let leftTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000);
      let d = parseInt(leftTime / (24 * 60 * 60));
      let h = this.formate(parseInt((leftTime / (60 * 60)) % 24));
      let m = this.formate(parseInt((leftTime / 60) % 60));
      let s = this.formate(parseInt(leftTime % 60));
      if (leftTime <= 0) {
        this.flag = true;
        this.handIn();
      }
      this.time = `${d}天${h}小时${m}分${s}秒`;
    },
    formate(time) {
      if (time >= 10) {
        return time;
      } else {
        return `0${time}`;
      }
    },
  },
  mounted() {
    this.getExam(this.$route.params.id);
  },
};
</script>
