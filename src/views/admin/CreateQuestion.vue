<template>
  <v-container style="min-height:600px">
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-card class="mx-auto my-10 px-5">
      <v-row>
        <v-col cols="12" sm="10" md="10">
          <mavon-editor
            ref="md"
            v-model="question.question"
            codeStyle="vs2015"
            :ishljs="true"
            style="height:85vh;z-index: 1;border: 1px solid #d2d2d2;margin-bottom:20px;"
            @imgAdd="$imgAdd"
          />
          <!-- <v-textarea
            ref="textarea"
            v-model="question.question"
            label="题目"
            color="orange"
            auto-grow
            outlined
            row-height="25"
          ></v-textarea> -->
          <v-select
            v-model="question.type"
            :items="questionTypeList"
            item-text="type"
            item-value="id"
            label="选择题目类型"
            @change="(value) => changeQuestionType(index, value)"
            outlined
          ></v-select>
          <div
            class="px-2 mb-5"
            v-if="question.type === 0 || question.type === 1"
          >
            <v-subheader class="mb-1" style="margin-left:-20px"
              >选项</v-subheader
            >
            <v-row
              v-for="(option, optioninIndex) in question.options"
              :key="optioninIndex"
            >
              <v-text-field
                v-model="question.options[optioninIndex]"
                clearable
                outlined
                prepend-inner-icon="mdi-lightbulb-on-outline"
                :label="'选项' + (optioninIndex + 1)"
                required
                style="display:inline-flex;vertical-align: sub;"
              ></v-text-field>
              <v-btn
                class="ml-2"
                small
                fab
                color="primary"
                @click="question.options.splice(optioninIndex, 1)"
              >
                <v-icon dark>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-row>
            <v-row class="justify-center">
              <v-btn small fab color="primary" @click="addOption">
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-row>
          </div>
          <v-row class="px-2 mb-5" v-if="question.type === 0">
            <v-radio-group v-model="question.rightAnswer" label="正确答案" row>
              <v-radio
                v-for="(option, optionIndex) in question.options"
                :key="optionIndex"
                :label="option"
                :value="String.fromCharCode(optionIndex + 65)"
              ></v-radio>
            </v-radio-group>
          </v-row>
          <v-row class="px-2 mb-5" v-if="question.type === 1">
            <v-checkbox
              v-model="question.rightAnswer"
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              :label="option"
              :value="String.fromCharCode(optionIndex + 65)"
            ></v-checkbox>
          </v-row>

          <v-radio-group
            v-if="question.type === 2"
            v-model="question.rightAnswer"
            label="正确答案"
            row
          >
            <v-radio color="red" label="错误" value="false"></v-radio>
            <v-radio color="success" label="正确" value="true"></v-radio>
          </v-radio-group>
          <div class="px-2 mb-5" v-if="question.type === 3">
            <v-subheader class="mb-2" style="margin-left:-20px"
              >答案</v-subheader
            >
            <v-row
              v-for="(answer, answerIndex) in question.rightAnswer"
              :key="answerIndex"
            >
              <v-text-field
                v-model="question.rightAnswer[answerIndex]"
                clearable
                outlined
                prepend-inner-icon="mdi-lightbulb-on-outline"
                :label="'空白处' + (answerIndex + 1)"
                required
                style="display:inline-flex;vertical-align: sub;"
              ></v-text-field>
              <v-btn
                class="ml-2"
                small
                fab
                color="primary"
                @click="question.rightAnswer.splice(answerIndex, 1)"
              >
                <v-icon dark>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-row>
            <v-row class="justify-center">
              <v-btn
                small
                fab
                color="primary"
                @click="question.rightAnswer.push('')"
              >
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-row>
          </div>
          <v-textarea
            ref="textarea"
            v-model="question.rightAnswer"
            v-if="question.type === 4"
            label="正确答案"
            auto-grow
            outlined
            row-height="25"
          ></v-textarea>
          <v-select
            v-model="question.pointId"
            :items="pointList"
            item-text="point"
            item-value="id"
            label="选择知识点"
            outlined
          ></v-select>
          <v-alert dismissible type="success">
            如果知识点列表中没有相应的知识点时，请在此输入来创建知识点！如果列表中已经存在，则忽略下面的输入框！
          </v-alert>
          <v-text-field
            v-model="point"
            clearable
            outlined
            prepend-inner-icon="mdi-lightbulb-on-outline"
            label="新增知识点"
            required
            style="display:inline-flex;vertical-align: sub;"
          ></v-text-field>
          <v-btn class="ma-3" small fab color="primary" @click="savePoint()">
            <v-icon dark>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <div class="my-5" style="text-align:right">
      <v-btn color="primary" @click="saveQuestion">
        完成
      </v-btn>
      <v-btn class="mx-5" text to="/admin/question">
        取消
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import "mavon-editor/dist/highlightjs/highlight.min.js";
import Vue from "vue";
// use
Vue.use(mavonEditor);
export default {
  name: "CreateCourse",
  data() {
    return {
      breadcrumbs: [
        {
          text: "题目列表",
          disabled: false,
          exact: true,
          to: "/admin/question",
        },
        {
          text: "添加题目",
          disabled: true,
        },
      ],
      questionTypeList: [
        {
          id: 0,
          type: "单选题",
        },
        {
          id: 1,
          type: "多选题",
        },
        {
          id: 2,
          type: "判断题",
        },
        {
          id: 3,
          type: "填空题",
        },
        {
          id: 4,
          type: "问答题",
        },
      ],
      pointList: [],
      point: "",
      question: {
        question: "",
        type: 0,
        options: [""],
        rightAnswer: "",
        pointId: "",
      },
      uploadLoadingList: [],
      imgUploadLoading: false,
      saveLoading: false,
    };
  },
  computed: {
    ...mapState(["token"]),
    isEdit() {
      console.log(this.$route.fullPath.indexOf("edit") > 0);
      return this.$route.fullPath.indexOf("edit") > 0;
    },
  },
  methods: {
    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      console.log($file);
      if ($file.size / 1000 > 1024) {
        this.$toast({
          color: "warning",
          mode: "",
          snackbar: true,
          text: "请上传小于1M的图片,此照片上传无效",
          timeout: 2000,
          x: "right",
          y: "top",
        });
        this.$refs.md.$refs.toolbar_left.$imgDelByFilename($file.name);
        return;
      }
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("uploadFile", $file);
      this.$api
        .uploadFile(formdata)
        .then((res) => {
          if (res.data.code == 200) {
            // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
            /**
             * $vm 指为mavonEditor实例，可以通过如下两种方式获取
             * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
             * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
             */
            console.log(this.$refs.md);
            this.$refs.md.$img2Url(pos, res.data.data);
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        });
    },
    change(file) {
      if (!file) {
        return;
      }
      console.log(file.size / 1000);
      if (file.size / 1000 > 1024) {
        this.$toast({
          color: "warning",
          mode: "",
          snackbar: true,
          text: "请上传小于1M的图片",
          timeout: 2000,
          x: "right",
          y: "top",
        });
        return;
      }
      console.log(file);
      let formData = new FormData();
      formData.append("uploadFile", file);
      this.uploadFile(formData);
    },
    clear() {
      this.post.imageUrl = "";
    },
    uploadFile(formData) {
      console.log(formData);
      this.$api
        .uploadFile(formData)
        .then((res) => {
          if (res.data.code == 200) {
            this.post.imageUrl = res.data.data;
            console.log("成功");
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        });
    },
    changeQuestionType(index, type) {
      console.log(index + "----" + type);
      switch (type) {
        case 0:
          this.question.options = ["", ""];
          break;
        case 1:
          this.question.options = ["", ""];
          this.question.rightAnswer = [];
          break;
        case 2:
          break;
        case 3:
          this.question.rightAnswer = [""];
          break;
        case 4:
          break;
        default:
          break;
      }
    },
    addOption() {
      this.question.options.push("");
    },
    getPointList() {
      this.$api
        .getPointList()
        .then((res) => {
          if (res.data.code == 200) {
            this.pointList = res.data.data.records;
          } else {
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
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "加载知识点列表失败,请稍后重试!",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {});
    },
    savePoint() {
      this.$api
        .savePoint({ point: this.point })
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
            this.getPointList();
          } else {
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
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "新增知识点失败,请稍后重试!",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {
          this.point = "";
        });
    },
    getQuestion(questionId) {
      this.$api
        .getQuestion({
          questionId: questionId,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.question = res.data.data;
            if (this.question.type == 0 || this.question.type == 1) {
              this.question.options = this.question.options.split(",");
            }
            if (this.question.type == 1 || this.question.type == 3) {
              this.question.rightAnswer = this.question.rightAnswer.split(",");
            }
          } else {
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
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "系统异常,请稍后重试!",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {});
    },
    saveQuestion() {
      this.saveLoading = true;
      if (this.question.type == 0 || this.question.type == 1) {
        this.question.options = this.question.options.join(",");
      }
      if (this.question.type == 1 || this.question.type == 3) {
        this.question.rightAnswer = this.question.rightAnswer.join(",");
      }
      this.$api
        .saveQuestion(this.question)
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
            this.$router.push("/admin/question");
          } else {
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
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "系统异常,请稍后重试!",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
  },
  mounted() {
    this.getPointList();
    if (this.isEdit) {
      this.breadcrumbs[1].text = "修改题目";
      this.getQuestion(this.$route.query.questionId);
    }
  },
};
</script>
