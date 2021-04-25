<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-stepper v-model="stepper">
      <v-stepper-header>
        <v-stepper-step :complete="stepper > 1" step="1"
          >完善试卷题目
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="stepper > 2" step="2"
          >完善试卷信息
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="ma-3 pa-2">
            <v-card-title class="headline mb-4">
              试卷：
            </v-card-title>

            <v-alert
              dismissible
              type="info"
              v-if="this.paper.questionList.length == 0"
            >
              没有添加任何题目呢，快去添加吧！
            </v-alert>

            <v-card-subtitle>
              <v-expansion-panels multiple>
                <v-expansion-panel
                  v-for="(question, index) in this.paper.questionList"
                  :key="index"
                >
                  <v-expansion-panel-header disable-icon-rotate>
                    <v-row no-gutters>
                      <v-col cols="8">
                        <v-chip color="primary">
                          题目类型：{{ question.type | typeFormat }}
                        </v-chip>
                        <v-chip class="ma-2" color="orange" dark>
                          知识点：{{ question.point.point }}
                        </v-chip>
                        <v-chip class="ma-2" color="green" text-color="white">
                          题目：{{ question.question.substring(0, 20) + "..." }}
                        </v-chip>
                      </v-col>
                      <v-col
                        cols="4"
                        class="text--secondary"
                        style="text-align: center;line-height: 3;"
                      >
                        <v-fade-transition leave-absolute>
                          <span v-if="question.score" key="1">
                            分值：{{ question.score }}
                          </span>
                          <span v-else key="0">
                            尚未设置题目分值
                          </span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                    <template v-slot:actions>
                      <v-icon color="teal" v-if="question.score">
                        mdi-check
                      </v-icon>
                      <v-icon color="error" v-else>
                        mdi-alert-circle
                      </v-icon>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    {{ question }}
                    <v-row>
                      <v-col cols="8">
                        <v-subheader class="pl-0">
                          设置题目分值
                          <v-chip
                            class="ml-2"
                            color="primary"
                            small
                            outlined
                            pill
                            @click="question.score = 5"
                          >
                            5分
                          </v-chip>
                          <v-chip
                            class="ml-2"
                            color="primary"
                            small
                            outlined
                            pill
                            @click="question.score = 10"
                          >
                            10分
                          </v-chip>
                          <v-chip
                            class="ml-2"
                            color="primary"
                            small
                            outlined
                            pill
                            @click="question.score = 20"
                          >
                            20分
                          </v-chip>
                        </v-subheader>
                        <v-slider
                          v-model="question.score"
                          thumb-label
                        ></v-slider>
                      </v-col>
                      <v-col cols="4">
                        <v-btn
                          :disabled="index == 0"
                          class="ma-3"
                          small
                          fab
                          color="primary"
                          @click="swapQuestion(index - 1, index)"
                        >
                          <v-icon dark>
                            mdi-arrow-up
                          </v-icon>
                        </v-btn>
                        <v-btn
                          :disabled="index == paper.questionList.length - 1"
                          class="ma-3"
                          small
                          fab
                          color="primary"
                          @click="swapQuestion(index, index + 1)"
                        >
                          <v-icon dark>
                            mdi-arrow-down
                          </v-icon>
                        </v-btn>
                        <v-btn
                          class="ma-3"
                          small
                          fab
                          color="primary"
                          @click="paper.questionList.splice(index, 1)"
                        >
                          <v-icon dark>
                            mdi-delete
                          </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-subtitle>
          </v-card>
          <v-row class="align-center justify-center my-3">
            <v-card class="ma-2 pa-3" dark color="#385F73">
              <v-select
                v-model="selectType"
                :items="questionTypeList"
                item-text="type"
                item-value="id"
                label="选择题目类型"
                clearable
                outlined
                style="display:inline-flex;vertical-align: sub;"
              ></v-select>
              <v-select
                class="mx-2"
                v-model="selectPoint"
                :items="pointList"
                item-text="point"
                item-value="id"
                label="选择知识点"
                clearable
                outlined
                style="display:inline-flex;vertical-align: sub;"
              ></v-select>
              <v-btn large color="primary" @click="addQuestionRandom()">
                根据条件随机添加题目
              </v-btn>
              <v-text-field
                v-model="search"
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="mdi-magnify"
                placeholder="根据条件精确搜索题目（按回车搜索）"
                @change="searchQuestionList"
                style="max-width:500px"
              />
            </v-card>
          </v-row>
          <v-alert
            dismissible
            type="info"
            v-if="this.searchedQuestionList.length == 0 && searched"
          >
            没有搜索到题目，请重试！
          </v-alert>
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
                <tr
                  v-for="(question, index) in searchedQuestionList"
                  :key="index"
                >
                  <td>{{ question.question.substring(0, 20) + "..." }}</td>
                  <td>{{ question.type }}</td>
                  <td>{{ question.point.point }}</td>
                  <td>
                    {{ question.createTime }}
                  </td>
                  <td>
                    <v-btn
                      color="primary"
                      :disabled="containsId(question.id)"
                      @click="addToPaper(question)"
                    >
                      {{
                        containsId(question.id)
                          ? "已添加到试卷"
                          : "添加到试卷中"
                      }}</v-btn
                    >
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

          <v-btn color="primary" @click="stepper = 2">
            下一步
          </v-btn>

          <v-btn class="mx-5" color="gray" text to="/admin/paper">
            取消
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-text-field
            class="my-2"
            v-model="paper.title"
            outlined
            clearable
            :counter="16"
            prepend-inner-icon="mdi-format-title"
            label="试卷名称"
            required
          ></v-text-field>
          <div class="ma-4">试卷总分：{{ totalScore }}</div>
          <v-text-field
            v-model="paper.startTime"
            label="开始时间"
            prepend-icon="mdi-clock-time-four-outline"
            hint="格式：YYYY-MM-DD HH:mm:ss"
          ></v-text-field>
          <v-text-field
            v-model="paper.endTime"
            label="结束时间"
            prepend-icon="mdi-clock-time-four-outline"
            hint="格式：YYYY-MM-DD HH:mm:ss"
          ></v-text-field>
          <v-btn color="cyan" dark @click="stepper = 1">
            上一步
          </v-btn>

          <v-btn class="mx-5" color="primary" @click="release">
            发布
          </v-btn>

          <v-btn text to="/admin/paper">
            取消
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
export default {
  name: "Paper",
  computed: {
    totalScore() {
      var totalScore = 0;
      this.paper.questionList.forEach((question) => {
        totalScore += question.score;
      });
      return totalScore;
    },
    isEdit() {
      console.log(this.$route.fullPath.indexOf("edit") > 0);
      return this.$route.fullPath.indexOf("edit") > 0;
    },
  },
  watch: {},
  data() {
    return {
      stepper: 1,
      breadcrumbs: [
        {
          text: "试卷列表",
          disabled: false,
          exact: true,
          to: "/admin/paper",
        },
        {
          text: "创建试卷",
          disabled: true,
        },
      ],
      selectType: "",
      selectPoint: "",
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
      search: "",
      searchedQuestionList: [],
      searched: false,
      //试卷
      paper: {
        title: "",
        startTime: "",
        endTime: "",
        questionList: [],
      },
      panel: [],
      //
      menu: false,
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    containsId(id) {
      for (const question of this.paper.questionList) {
        if (question.id == id) {
          return true;
        }
      }
      return false;
    },
    addQuestionRandom() {
      var questionIdList = [];
      this.paper.questionList.forEach((question) => {
        questionIdList.push(question.id);
      });
      this.$api
        .getQuestionRandom({
          type: this.selectType,
          pointId: this.selectPoint,
          questionIds: questionIdList.join(","),
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.paper.questionList.push(res.data.data);
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: "添加题目成功",
              timeout: 2000,
              x: "right",
              y: "top",
            });
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
            text: "随机添加题目失败,请稍后重试!",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {});
    },
    addToPaper(question) {
      for (const q of this.paper.questionList) {
        if (q.id == question.id) {
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "当前题目已经存在！",
            timeout: 2000,
            x: "right",
            y: "top",
          });
          return;
        }
      }
      this.paper.questionList.push(question);
    },
    swapQuestion(i, j) {
      this.paper.questionList.splice(i, 0, this.paper.questionList[j]);
      this.paper.questionList.splice(j + 1, 1);
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
    searchQuestionList() {
      this.$api
        .getQuestionList({
          search: this.search,
          type: this.selectType,
          pointId: this.selectPoint,
          current: this.current,
          size: this.size,
        })
        .then((res) => {
          this.searched = true;
          if (res.data.code == 200) {
            this.searchedQuestionList = res.data.data.records;
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
    getPaper(paperId) {
      this.$api
        .getPaper({
          paperId: paperId,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.paper = res.data.data;
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
    release() {
      this.$api
        .releasePaper(this.paper)
        .then((res) => {
          this.searched = true;
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
            this.$router.push("/admin/paper");
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
            text: "创建失败，请稍后重试！",
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
      this.searchQuestionList();
    },
    all() {
      this.panel = [...Array(this.items).keys()].map((k, i) => i);
    },
    none() {
      this.panel = [];
    },
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
  mounted() {
    this.getPointList();
    if (this.isEdit) {
      this.breadcrumbs[1].text = "修改试卷";
      this.getPaper(this.$route.query.paperId);
    }
  },
};
</script>
