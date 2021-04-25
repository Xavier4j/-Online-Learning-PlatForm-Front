<template>
  <v-container>
    {{ this.$route.query.video }}
    <v-row class="my-2">
      <v-col cols="8">
        <v-card color="black">
          <v-responsive :aspect-ratio="16 / 9">
            <video
              style="width:100%;height:100%"
              :poster="course.coverImageUrl"
              controls
              :src="course.videoList[current].url"
            ></video>
          </v-responsive>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto pa-5" tile>
          <v-list>
            <v-subheader class="text-h5 mb-5">{{ course.name }}</v-subheader>
            <v-list-item-group v-model="current" color="primary">
              <v-list-item
                v-for="(video, index) in course.videoList"
                :key="index"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="video.point"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row class="ma-5">
      <v-btn color="primary" dark>
        <v-icon left>
          mdi-star
        </v-icon>
        收藏
      </v-btn>
    </v-row> -->
    <v-divider></v-divider>
    <Discussion :belongId="this.$route.params.id" />
  </v-container>
</template>

<script>
export default {
  name: "Course",
  data() {
    return {
      current: 0,
      course: {
        videoList: [{ url: "" }],
      },
    };
  },
  components: {
    Discussion: () => import("@/components/Discussion"),
  },
  methods: {
    getCourse(id) {
      this.$api
        .getCourse({ courseId: id })
        .then((res) => {
          if (res.data.code == 200) {
            this.course = res.data.data;
            if (this.$route.query.video) {
              this.current = this.course.videoList.findIndex((v) => {
                return v.id == this.$route.query.video;
              });
            } else {
              this.current = 0;
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
            text: "加载课程失败,请稍后重试!",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {});
    },
  },
  created() {
    this.getCourse(this.$route.params.id);
  },
  mounted() {},
};
</script>
