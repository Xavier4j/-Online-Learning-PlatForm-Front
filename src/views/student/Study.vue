<template>
  <v-container>
    <v-carousel v-model="model">
      <v-carousel-item v-for="(color, i) in colors" :key="color">
        <v-sheet :color="color" height="100%" tile>
          <v-row class="fill-height" align="center" justify="center">
            <div class="display-3">Slide {{ i + 1 }}</div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
    <v-row>
      <v-col v-for="(course, index) in courseList" :key="index" cols="6">
        <v-card class="mt-5" color="#385F73" dark>
          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
          >
            <v-chip class="ma-2" color="primary" style="float:right;top:-100px">
              Primary
            </v-chip>
            <v-card-title class="mb-6" style="font-size:20px">
              {{ course.name }}
            </v-card-title>
            <v-card-subtitle>{{ course.desc }}</v-card-subtitle></v-img
          >

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text>
              开始学习！
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" style="text-align: center;">
        <v-chip v-if="loading">加载中，请稍等...</v-chip>
        <v-btn
          v-else
          outlined
          :disabled="isLastPage"
          @click="getCourseList(plateId)"
          :color="isLastPage ? 'gray' : 'orange'"
          >{{ isLastPage ? "没有更多了" : "加载更多" }}</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Study",
  data() {
    return {
      model: 0,
      colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
      courseList: [
        { id: "1", name: "课程1", desc: "简介1" },
        { id: "2", name: "课程2", desc: "简介2" },
        { id: "1", name: "课程1", desc: "简介1" },
        { id: "2", name: "课程2", desc: "简介2" },
        { id: "1", name: "课程1", desc: "简介1" },
        { id: "2", name: "课程2", desc: "简介2" },
        { id: "1", name: "课程1", desc: "简介1" },
        { id: "2", name: "课程2", desc: "简介2" },
        { id: "1", name: "课程1", desc: "简介1" },
        { id: "2", name: "课程2", desc: "简介2" },
        { id: "1", name: "课程1", desc: "简介1" },
        { id: "2", name: "课程2", desc: "简介2" },
      ],
      loading: false, //加载项
      current: 0,
      size: 20,
      isLastPage: false,
      totalCount: 0,
    };
  },
  methods: {
    getCourseList() {
      this.loading = true;
      this.$api
        .searchCourseList({
          current: this.current,
          size: this.size,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.isLastPage = res.data.data.isLastPage;
            if (!this.isLastPage) {
              this.size++;
            }
            this.courseList.push(...res.data.data.list);
            this.courseList.forEach((item) => {
              item.show = false;
            });
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    loadMore() {},
  },
  created() {},
  mounted() {
    this.getCourseList();
  },
};
</script>
