<template>
  <v-container style="min-height:600px">
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-stepper v-model="stepper">
      <v-stepper-header>
        <v-stepper-step :complete="stepper > 1" step="1"
          >完善课程视频
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="stepper > 2" step="2"
          >完善课程信息
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-alert dismissible type="info" v-if="this.videoList.length == 0">
            没有添加任何视频呢，快去添加吧！
          </v-alert>
          <v-card
            class="mx-auto my-10 px-5"
            max-width="800"
            v-for="(video, index) in videoList"
            :key="index"
          >
            <v-progress-linear
              :active="uploadLoadingList[index].uploadLoading"
              :indeterminate="uploadLoadingList[index].uploadLoading"
              absolute
              top
              color="deep-purple accent-4"
            ></v-progress-linear>
            <v-row>
              <v-col cols="12" sm="10" md="10">
                <span style="line-height:400%;">点击选择视频文件：</span>
                <v-file-input
                  ref="upload"
                  accept="video/*"
                  hide-input
                  prepend-icon="mdi-video"
                  :disabled="uploadLoadingList[index].uploadLoading"
                  clearable
                  @change="(file) => changeVideo(file, index)"
                  style="display:inline-flex;vertical-align: top;"
                ></v-file-input>
                <v-text-field
                  v-model="video.url"
                  clearable
                  outlined
                  prepend-inner-icon="mdi-link-variant"
                  label="课程视频地址"
                  required
                ></v-text-field>
                <v-select
                  v-model="video.pointId"
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
                <v-btn
                  class="ma-3"
                  small
                  fab
                  color="primary"
                  @click="savePoint()"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col class="mt-10 pt-10" cols="12" sm="2" md="2">
                <v-btn
                  :disabled="index == 0"
                  class="ma-3"
                  small
                  fab
                  color="primary"
                  @click="swapVideo(index - 1, index)"
                >
                  <v-icon dark>
                    mdi-arrow-up
                  </v-icon>
                </v-btn>
                <v-btn
                  :disabled="index == videoList.length - 1"
                  class="ma-3"
                  small
                  fab
                  color="primary"
                  @click="swapVideo(index, index + 1)"
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
                  @click="videoList.splice(video, 1)"
                >
                  <v-icon dark>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
          <div class="my-5" style="text-align:center">
            <v-btn class="mx-auto" color="pink" fab @click="addVideo">
              <v-icon color="white">mdi-plus</v-icon>
            </v-btn>
          </div>
          <v-btn color="primary" @click="stepper = 2">
            下一步
          </v-btn>

          <v-btn class="mx-5" text to="/admin/course">
            取消
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <span style="line-height:400%;"
            >点击选择封面图片(建议比例16:9)：</span
          >
          <v-file-input
            ref="upload"
            accept="image/*"
            hide-input
            prepend-icon="mdi-image"
            :disabled="imgUploadLoading"
            clearable
            @change="changeImage"
            style="display:inline-flex;vertical-align: top;"
          ></v-file-input>
          <v-card class="mb-5" max-width="600px">
            <v-img :src="course.coverImageUrl" :aspect-ratio="16 / 9"> </v-img>
          </v-card>
          <v-text-field
            v-model="course.name"
            outlined
            clearable
            :counter="16"
            prepend-inner-icon="mdi-format-title"
            label="课程名称"
            required
          ></v-text-field>
          <v-textarea
            v-model="course.description"
            outlined
            :counter="200"
            required
            prepend-inner-icon="mdi-subtitles"
            label="课程简介"
          ></v-textarea>

          <v-btn color="cyan" dark @click="stepper = 1">
            上一步
          </v-btn>

          <v-btn class="mx-5" color="primary" @click="release">
            发布
          </v-btn>

          <v-btn text to="/admin/course">
            取消
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "CreateCourse",
  data() {
    return {
      stepper: 1,
      breadcrumbs: [
        {
          text: "课程列表",
          disabled: false,
          exact: true,
          to: "/admin/course",
        },
        {
          text: "创建课程",
          disabled: true,
        },
      ],
      pointList: [],
      point: "",
      videoList: [],
      uploadLoadingList: [],
      imgUploadLoading: false,
      course: {
        teacherId: "",
        description: "",
        coverImageUrl: "",
        videoList: [],
      },
      releaseLoading: false,
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
    changeVideo(file, index) {
      if (!file) {
        return;
      }
      console.log(file.size / 1000);
      let formData = new FormData();
      formData.append("uploadFile", file);
      this.uploadVideo(formData, index);
    },
    uploadVideo(formData, index) {
      this.uploadLoadingList[index].uploadLoading = true;
      console.log(formData);
      this.$api
        .uploadFile(formData)
        .then((res) => {
          if (res.data.code == 200) {
            this.videoList[index].url = res.data.data;
            console.log("上传成功");
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.uploadLoadingList[index].uploadLoading = false;
        });
    },
    changeImage(file) {
      if (!file) {
        return;
      }
      console.log(file.size / 1000);
      let formData = new FormData();
      formData.append("uploadFile", file);
      this.uploadImage(formData);
    },
    uploadImage(formData) {
      this.imgUploadLoading = true;
      console.log(formData);
      this.$api
        .uploadFile(formData)
        .then((res) => {
          if (res.data.code == 200) {
            this.course.coverImageUrl = res.data.data;
            console.log("上传成功");
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.imgUploadLoading = false;
        });
    },
    addVideo() {
      this.videoList.push({
        url: "",
        pointId: "",
      });
      this.uploadLoadingList.push({ uploadLoading: false });
    },
    swapVideo(i, j) {
      this.videoList.splice(i, 0, this.videoList[j]);
      this.videoList.splice(j + 1, 1);
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
    getCourse(courseId) {
      this.$api
        .getCourse({
          courseId: courseId,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.course = res.data.data;
            this.videoList = this.course.videoList;
            for (let index = 0; index < this.videoList.length; index++) {
              this.uploadLoadingList.push({ uploadLoading: false });
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
    release() {
      this.releaseLoading = true;
      this.course.teacherId = this.token;
      this.course.videoList = this.videoList;
      this.$api
        .releaseCourse(this.course)
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
            this.$router.push("/admin/course");
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
          this.releaseLoading = false;
        });
    },
  },
  mounted() {
    this.getPointList();
    if (this.isEdit) {
      this.breadcrumbs[1].text = "修改课程";
      this.getCourse(this.$route.query.courseId);
    }
  },
};
</script>
