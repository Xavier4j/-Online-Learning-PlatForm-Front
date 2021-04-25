<template>
  <v-container>
    <v-carousel v-model="model">
      <v-carousel-item
        v-for="(course, index) in courseList.slice(0, 4)"
        :key="index"
        :to="'course/' + course.id"
      >
        <v-img
          :src="course.coverImageUrl"
          class="white--text align-end"
          height="100%"
        >
          <v-card-title v-text="course.name"></v-card-title>
        </v-img>

        <!-- <v-sheet height="100%" tile>
          <v-row class="fill-height" align="center" justify="center">
            <div class="display-3">{{ course.name }}</div>
          </v-row>
        </v-sheet> -->
      </v-carousel-item>
    </v-carousel>
    <v-row>
      <v-col v-for="(course, index) in courseList" :key="index" cols="6">
        <v-card class="mt-5" color="#385F73" dark>
          <v-img
            :src="course.coverImageUrl"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
          >
            <!-- <v-chip class="ma-2" color="primary" style="float:right;top:-90px">
              Primary
            </v-chip> -->
            <v-card-title class="mb-6" style="font-size:20px">
              {{ course.name }}
            </v-card-title>
            <v-card-subtitle>{{ course.desc }}</v-card-subtitle></v-img
          >

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text :to="'course/' + course.id">
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
          :disabled="current > pages"
          @click="getCourseList()"
          :color="current > pages ? 'gray' : 'orange'"
          >{{ current > pages ? "没有更多了" : "加载更多" }}</v-btn
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
      courseList: [],
      loading: false, //加载项
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
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
            this.pages = res.data.data.pages;
            if (this.current <= this.pages) {
              this.current++;
            }
            this.courseList.push(...res.data.data.records);
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
