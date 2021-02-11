<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="5">
        <v-menu
          v-model="datePicker1"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="start"
              label="Start"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="start"
            @input="datePicker1 = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" md="5">
        <v-menu
          v-model="datePicker2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="end"
              label="End"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="end"
            @input="datePicker2 = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" md="2">
        <v-btn color="success" class="mb-3" @click="analysis">分析</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-chip class="my-3" color="orange" label text-color="white"
          >论坛整体情感倾向：</v-chip
        >
        <v-card
          min-height="500"
          flat
          :loading="sentitiveLoading"
          style="background:none"
        >
          <div class="pa-2" id="sentitive-chart"></div>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-chip class="my-3" color="orange" label text-color="white"
          >论坛热点：</v-chip
        >
        <v-card
          min-height="500"
          flat
          :loading="keywordLoading"
          style="background:none"
        >
          <div class="ma-5" id="keyword-chart"></div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-chip class="my-3" color="orange" label text-color="white"
          >热门话题（一级分类）：</v-chip
        >
        <v-card
          min-height="500"
          flat
          :loading="topicLoading1"
          style="background:none"
        >
          <div class="ma-5" id="topic-chart1"></div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-chip class="my-3" color="orange" label text-color="white"
          >热门话题（二级分类）：</v-chip
        >
        <v-card
          min-height="500"
          flat
          :loading="topicLoading2"
          style="background:none"
        >
          <div class="ma-5" id="topic-chart2"></div>
        </v-card>
      </v-col>
    </v-row>
    <v-chip class="my-3" color="orange" label text-color="white"
      >帖子负面消息排行榜：</v-chip
    >
    <v-card flat :loading="negativeLoading" style="background:none">
      <v-alert
        dense
        prominent
        color="teal"
        outlined
        v-for="(negativeAnalysis, index) in negativeAnalysisList"
        :key="index"
      >
        <v-row align="center">
          <v-col class="grow">{{ negativeAnalysis.content }}</v-col>
          <v-col class="shrink">
            <v-chip
              color="cyan"
              outlined
              @click="toView(negativeAnalysis.post.id)"
              >{{ negativeAnalysis.post.title }}</v-chip
            >
          </v-col>
        </v-row>
      </v-alert>
    </v-card>
    <v-chip class="my-3" color="orange" label text-color="white"
      >帖子热度排行榜：</v-chip
    >
    <v-card
      class="py-3"
      flat
      :loading="hotPostLoading"
      style="background:none"
      min-height="500"
    >
      <v-expansion-panels>
        <v-expansion-panel v-for="(post, index) in hotPostList" :key="index">
          <v-expansion-panel-header>{{ post.title }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="7">
                <v-slider
                  style="margin-top:100px;"
                  v-model="post.positiveProbAverage"
                  readonly
                  :thumb-size="50"
                  thumb-label="always"
                  inverse-label
                  :label="'情感倾向：' + post.positiveProbAverage"
                >
                  <template v-slot:thumb-label="{ value }">{{
                    satisfactionEmojis[Math.min(Math.floor(value / 10), 9)]
                  }}</template>
                </v-slider>

                <v-chip class="ma-2" color="success" outlined
                  >正向评论:{{ post.positiveCommentNum }}</v-chip
                >
                <v-chip class="ma-2" color="cyan" outlined
                  >中性评论:{{ post.neutralCommentNum }}</v-chip
                >
                <v-chip class="ma-2" color="red" outlined
                  >负向评论:{{ post.negativeCommentNum }}</v-chip
                >
              </v-col>

              <v-spacer></v-spacer>

              <v-divider vertical class="mx-4"></v-divider>

              <v-col cols="4">
                <v-chip class="ma-2" color="primary" outlined
                  >阅读人数:{{ post.readNum }}</v-chip
                >
                <v-chip class="ma-2" color="orange" outlined
                  >评论人数:{{ post.commentNum }}</v-chip
                >
                <v-divider></v-divider>
                <v-chip
                  class="ma-2"
                  color="grey"
                  outlined
                  v-for="(commentTag, index) in post.commentTagList"
                  :key="index"
                  >{{ commentTag.tag }}</v-chip
                >
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn text color="secondary"></v-btn> -->
              <v-btn text color="primary" @click="toView(post.id)">浏览</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment/moment";
export default {
  name: "Home",
  data() {
    return {
      datePicker1: false,
      datePicker2: false,
      start: moment()
        .subtract(13, "days")
        .format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),

      hotPostLoading: false,
      sentitiveLoading: false,
      keywordLoading: false,
      topicLoading1: false,
      topicLoading2: false,
      negativeLoading: false,

      hotPostList: [],
      satisfactionEmojis: [
        "😭",
        "😢",
        "☹️",
        "🙁",
        "😐",
        "🙂",
        "😊",
        "😁",
        "😄",
        "😍",
      ],
      sentitiveAnalysisList: [],
      topicAnalysisList: [],
      KeywordAnalysisList: [],
      negativeAnalysisList: [],
    };
  },
  methods: {
    analysis() {
      this.getSentitiveAnalysis();
      this.getHotPostList();
      this.getTopicAnalysis();
      this.getKeywordAnalysis();
      this.getNegativeAnalysis();
    },
    toView(id) {
      const { href } = this.$router.resolve({
        path: `/post`,
        query: {
          id: id,
        },
      });
      window.open(href, "_blank");
    },
    getHotPostList() {
      this.hotPostLoading = true;
      this.$api
        .getHotPostList()
        .then((res) => {
          if (res.data.code == 200) {
            this.hotPostList = res.data.data.list;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.hotPostLoading = false;
        });
    },
    getSentitiveAnalysis() {
      this.sentitiveLoading = true;
      this.$api
        .getSentitiveAnalysis({
          start: this.start,
          end: this.end,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.sentitiveAnalysisList = res.data.data;
            this.renderSentitiveChart(
              this.sentitiveChart,
              this.sentitiveAnalysisList,
              "#f0657d"
            );
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.sentitiveLoading = false;
        });
    },
    getTopicAnalysis() {
      this.topicLoading1 = true;
      this.topicLoading2 = true;
      this.$api
        .getTopicAnalysis({
          start: this.start,
          end: this.end,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.topicAnalysisList = res.data.data;
            this.renderTagChart(
              this.topicChart1,
              this.topicAnalysisList.lv1TagList,
              "#009688"
            );
            this.renderTagChart(
              this.topicChart2,
              this.topicAnalysisList.lv2TagList,
              "#F44336"
            );
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.topicLoading1 = false;
          this.topicLoading2 = false;
        });
    },
    getKeywordAnalysis() {
      this.keywordLoading = true;
      this.$api
        .getKeywordAnalysis({
          start: this.start,
          end: this.end,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.KeywordAnalysisList = res.data.data;
            this.renderTagChart(
              this.keywordChart,
              this.KeywordAnalysisList,
              "#E91E63"
            );
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.keywordLoading = false;
        });
    },
    getNegativeAnalysis() {
      this.negativeLoading = true;
      this.$api
        .getNegativeAnalysis({
          start: this.start,
          end: this.end,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.negativeAnalysisList = res.data.data.list;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.negativeLoading = false;
        });
    },
    renderSentitiveChart(chart, data, color) {
      chart.data(data);
      chart.scale({
        date: {
          range: [0, 1],
        },
        value: {
          min: 0,
          nice: true,
        },
      });
      chart.tooltip({
        showMarkers: false,
      });
      chart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true,
      });
      chart
        .line()
        .position("date*value")
        .label("value")
        .color(color);
      chart.point().position("date*value");

      chart.render();
    },
    renderTagChart(chart, data, color) {
      chart.data(data);
      chart.scale("score", { nice: true });
      chart.coordinate().transpose();
      chart.tooltip({
        showMarkers: false,
      });
      chart.interaction("active-region");
      chart
        .interval()
        .position("tag*score")
        .color(color);
      chart.render();

      chart.on("element:click", (ev) => {
        this.$router.push({
          path: "post",
          query: {
            keyword: ev.data.data.tag,
          },
        });
      });
    },
  },
  mounted() {
    // this.sentitiveChart = new Chart({
    //   container: "sentitive-chart",
    //   autoFit: true,
    //   height: 500,
    // });
    // this.topicChart1 = new Chart({
    //   container: "topic-chart1",
    //   autoFit: true,
    //   height: 500,
    // });
    // this.topicChart2 = new Chart({
    //   container: "topic-chart2",
    //   autoFit: true,
    //   height: 500,
    // });
    // this.keywordChart = new Chart({
    //   container: "keyword-chart", // 指定图表容器 ID
    //   autoFit: true,
    //   height: 500, // 指定图表高度
    // });
    // this.getHotPostList();
    // this.getSentitiveAnalysis();
    // this.getTopicAnalysis();
    // this.getKeywordAnalysis();
    // this.getNegativeAnalysis();
  },
};
</script>
