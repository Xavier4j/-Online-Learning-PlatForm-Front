<template>
  <v-container min-height="600px" :loading="contentLoading">
    <v-row class="mx-2 my-2">
      <p style="font-size: 20px; word-wrap: break-word; margin: 15px 0">
        {{ exam.title }}
      </p>
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
      <v-card-title>
        题目{{ index + 1 }}
        <v-spacer></v-spacer>
        <span v-if="!(question.type === 4 && !question.score)">
          <v-chip
            class="text-button"
            small
            v-if="exam.answerList[index].score == question.score"
            color="success"
          >
            <v-icon class="mr-2">mdi-check</v-icon
            >{{ exam.answerList[index].score + "/" + question.score }}
          </v-chip>
          <v-chip
            class="text-button"
            small
            v-else-if="exam.answerList[index].score == 0"
            color="error"
          >
            <v-icon class="mr-2">mdi-close</v-icon
            >{{ exam.answerList[index].score + "/" + question.score }}
          </v-chip>
          <v-chip
            class="text-button"
            small
            v-else-if="exam.answerList[index].score < question.score"
            color="warning"
          >
            <v-icon class="mr-2">mdi-alert</v-icon
            >{{ exam.answerList[index].score + "/" + question.score }}
          </v-chip>
        </span>
      </v-card-title>

      <div class="px-6" v-html="question.question"></div>
      <v-card-actions class="px-6">
        <v-row class="px-2" v-if="question.type === 0">
          <v-radio-group
            v-model="exam.answerList[index].answer"
            label="你的答案"
            row
            readonly
          >
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
            v-model="exam.answerList[index].answer"
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            :label="option"
            :value="String.fromCharCode(optionIndex + 65)"
            readonly
          ></v-checkbox>
        </v-row>

        <v-radio-group
          v-if="question.type === 2"
          v-model="exam.answerList[index].answer"
          label="你的答案"
          readonly
          row
        >
          <v-radio color="red" label="错误" value="false"></v-radio>
          <v-radio color="success" label="正确" value="true"></v-radio>
        </v-radio-group>
        <div class="px-2" v-if="question.type === 3">
          <v-subheader class="mb-2" style="margin-left:-20px"
            >你的答案</v-subheader
          >
          <v-row
            v-for="(answer, answerIndex) in exam.answerList[index].answer"
            :key="answerIndex"
          >
            <v-text-field
              v-model="exam.answerList[index].answer[answerIndex]"
              clearable
              readonly
              outlined
              prepend-inner-icon="mdi-lightbulb-on-outline"
              :label="'空白处' + (answerIndex + 1)"
              required
              style="display:inline-flex;vertical-align: sub;"
            ></v-text-field>
          </v-row>
        </div>
        <v-textarea
          ref="textarea"
          v-model="exam.answerList[index].answer"
          v-if="question.type === 4"
          label="你的答案"
          readonly
          auto-grow
          outlined
          row-height="25"
        ></v-textarea>
      </v-card-actions>

      <v-card-actions
        class="px-6"
        v-if="
          exam.answerList[index].score < question.score ||
            !exam.answerList[index].score
        "
      >
        <v-row class="px-2" v-if="question.type === 0">
          <v-radio-group
            v-model="question.rightAnswer"
            label="正确答案"
            row
            readonly
          >
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
            v-model="question.rightAnswer"
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            :label="option"
            :value="String.fromCharCode(optionIndex + 65)"
            readonly
          ></v-checkbox>
        </v-row>

        <v-radio-group
          v-if="question.type === 2"
          v-model="question.rightAnswer"
          label="正确答案"
          readonly
          row
        >
          <v-radio color="red" label="错误" value="false"></v-radio>
          <v-radio color="success" label="正确" value="true"></v-radio>
        </v-radio-group>
        <div class="px-2" v-if="question.type === 3">
          <v-subheader class="mb-2" style="margin-left:-20px"
            >正确答案</v-subheader
          >
          <v-row
            v-for="(answer, answerIndex) in question.rightAnswer"
            :key="answerIndex"
          >
            <v-text-field
              v-model="question.rightAnswer[answerIndex]"
              clearable
              readonly
              outlined
              prepend-inner-icon="mdi-lightbulb-on-outline"
              :label="'空白处' + (answerIndex + 1)"
              required
              style="display:inline-flex;vertical-align: sub;"
            ></v-text-field>
          </v-row>
        </div>
        <v-alert
          style="width:100%"
          dismissible
          type="info"
          v-if="question.type === 4 && !exam.answerList[index].score"
        >
          等待老师批改!
        </v-alert>
      </v-card-actions>
    </v-card>
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
    getExamResult(id) {
      this.contentLoading = true;
      this.$api
        .getPaperResult({ paperId: id, userId: this.token })
        .then((res) => {
          if (res.data.code == 200) {
            this.exam = res.data.data;
            var md = mavonEditor.markdownIt;
            for (
              let index = 0;
              index < this.exam.questionList.length;
              index++
            ) {
              let question = this.exam.questionList[index];
              let answer = this.exam.answerList[index];
              if (question.type == 0 || question.type == 1) {
                question.options = question.options.split(",");
              }

              if (question.type == 1 || question.type == 3) {
                question.rightAnswer = question.rightAnswer.split(",");
                answer.answer = answer.answer.split(",");
              }

              question.question = md.render(question.question);
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
  },
  mounted() {
    this.getExamResult(this.$route.params.id);
  },
};
</script>
