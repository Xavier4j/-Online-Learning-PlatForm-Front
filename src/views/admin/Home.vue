<template>
  <v-container>
    路径错误，请返回
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
