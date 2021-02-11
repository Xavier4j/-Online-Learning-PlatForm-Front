<template>
  <v-container style="min-height:600px">
    <v-file-input hide-input truncate-length="15"></v-file-input>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert dismissible type="info" v-if="this.videoList.length == 0">
      <div class="display-1">
        没有添加任何视频呢，快去添加吧！
      </div>
    </v-alert>
    <v-card
      class="mx-auto"
      max-width="800"
      v-for="(video, index) in videoList"
      :key="index"
    >
      <v-progress-linear
        :active="uploadLoading"
        :indeterminate="uploadLoading"
        absolute
        top
        color="deep-purple accent-4"
      ></v-progress-linear>
      <v-row class="pa-2">
        <v-col cols="12" sm="8" md="8">
          <v-file-input
            ref="upload"
            accept="video/*"
            hide-input
            prepend-icon="mdi-camera"
            :disabled="uploadLoading"
            clearable
            dense
            @change="changeVideo"
          ></v-file-input>
          <v-text-field
            v-model="video.name"
            solo
            clearable
            :counter="16"
            prepend-inner-icon="mdi-link-variant"
            placeholder="课程名称"
            required
          ></v-text-field>
          <v-text-field
            v-model="video.name"
            solo
            clearable
            :counter="16"
            prepend-inner-icon="mdi-link-variant"
            placeholder="课程名称"
            required
          ></v-text-field>
          <v-text-field
            v-model="video.name"
            solo
            clearable
            prepend-inner-icon="mdi-magnify"
            label="User Search"
          />
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-btn
            :disabled="index == 0"
            class="mx-2"
            small
            fab
            color="primary"
            @click="videoList.splice(video, 1)"
          >
            <v-icon dark>
              mdi-arrow-up
            </v-icon>
          </v-btn>
          <v-btn
            :disabled="index == videoList.length - 1"
            class="mx-2"
            small
            fab
            color="primary"
            @click="videoList.splice(video, 1)"
          >
            <v-icon dark>
              mdi-arrow-down
            </v-icon>
          </v-btn>
          <v-btn
            class="mx-2"
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
      {{ video }}
    </v-card>
    <div class="my-5" style="text-align:center">
      <v-btn class="mx-auto" color="pink" fab @click="addVideo">
        <v-icon color="white">mdi-plus</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "CreateCourse",
  data() {
    return {
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
      uploadLoading: false,
      videoList: [
        {
          name: "video",
          url: "",
          point: "",
        },
      ],
    };
  },
  methods: {
    changeVideo(file) {
      if (!file) {
        return;
      }
      console.log(file.size / 1000);
      let formData = new FormData();
      formData.append("uploadFile", file);
      this.uploadFile(formData);
    },
    uploadFile(formData) {
      this.uploadLoading = true;
      console.log(formData);
      this.$api
        .uploadFile(formData)
        .then((res) => {
          if (res.data.code == 200) {
            this.videoList[0].url = res.data.data;
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
          this.uploadLoading = false;
        });
    },
    addVideo() {
      this.videoList.push({
        name: this.videoList.length,
        url: "",
        point: "",
      });
    },
    getPostListByTag() {
      this.loading = true;
      this.$api
        .getPostListByTag({
          keyword: this.keyword,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.postList = res.data.data;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
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
  },
  mounted() {
    this.keyword = this.$route.query.keyword;
    this.getPostListByTag();
  },
};
</script>
