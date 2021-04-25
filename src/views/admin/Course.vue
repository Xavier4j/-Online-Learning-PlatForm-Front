<template>
  <v-container class="p a-10">
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- <v-btn text color="secondary"></v-btn> -->
      <v-btn outlined color="primary" to="/admin/course/create">
        新增课程
      </v-btn>
    </v-card-actions>
    <v-simple-table style="background:none">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="font-size:15px;" class="text-left">课程名称</th>
            <th style="font-size:15px;" class="text-left">创建人</th>
            <th style="font-size:15px;" class="text-left">创建时间</th>
            <th style="font-size:15px;" class="text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(course, index) in courseList" :key="index">
            <td>{{ course.name }}</td>
            <td>{{ course.teacherId }}</td>
            <td>
              {{ course.createTime }}
            </td>
            <td>
              <v-icon small class="mr-2" @click="editCourse(course.id)">
                mdi-pencil
              </v-icon>
              <v-icon small class="mr-2" @click="deleteCourse(course.id)">
                mdi-delete
              </v-icon>
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
  </v-container>
</template>

<script>
export default {
  name: "Course",
  data() {
    return {
      courseList: [],
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    getCourseList() {
      this.$api
        .searchCourseList({ current: this.current, size: this.size })
        .then((res) => {
          if (res.data.code == 200) {
            this.courseList = res.data.data.records;
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
    editCourse(courseId) {
      this.$router.push({
        path: "/admin/course/edit",
        query: {
          courseId: courseId,
        },
      });
    },
    deleteCourse(courseId) {
      this.$api
        .deleteCourse({ courseId: courseId })
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
            this.getCourseList();
          } else {
            console.log("删除失败！");
            this.$toast({
              color: "success",
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
          console.log("删除失败！");
          console.log(err);
          this.$toast({
            color: "success",
            mode: "",
            snackbar: true,
            text: "删除失败，请稍后重试！",
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
      this.getCourseList();
    },
  },
  mounted() {
    this.getCourseList();
  },
};
</script>
