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
          >完善公告内容
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="stepper > 2" step="2"
          >完善公告信息
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-subheader class="pl-0">
            使用markdown语法编写
          </v-subheader>
          <v-stepper-content step="1">
            <mavon-editor
              ref="md"
              v-model="notice.content"
              codeStyle="vs2015"
              :ishljs="true"
              style="height:85vh;z-index: 1;border: 1px solid #d2d2d2;margin-bottom:20px;"
              @imgAdd="$imgAdd"
            />
            <v-btn color="primary" @click="stepper = 2">
              下一步
            </v-btn>
            <v-btn class="mx-5" color="gray" text to="/admin/notice">
              取消
            </v-btn>
          </v-stepper-content>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-text-field
            class="mt-2"
            v-model="notice.title"
            outlined
            clearable
            :counter="16"
            prepend-inner-icon="mdi-format-title"
            label="公告标题"
            required
          ></v-text-field>
          <!-- <span style="line-height:400%;"
            >点击选择封面图片(建议比例16:9)：</span
          >
          <v-file-input
            ref="upload"
            accept="image/*"
            hide-input
            prepend-icon="mdi-image"
            :disabled="imgUploadLoading"
            clearable
            @change="change"
            style="display:inline-flex;vertical-align: top;"
          ></v-file-input>
          <v-card class="mb-5" max-width="600px">
            <v-img :src="notice.coverImageUrl" :aspect-ratio="16 / 9"> </v-img>
          </v-card> -->
          <v-btn color="cyan" dark @click="stepper = 1">
            上一步
          </v-btn>

          <v-btn class="mx-5" color="primary" @click="release">
            发布
          </v-btn>

          <v-btn text to="/admin/notice">
            取消
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import "mavon-editor/dist/highlightjs/highlight.min.js";
import Vue from "vue";
// use
Vue.use(mavonEditor);
export default {
  name: "Notice",
  computed: {
    isEdit() {
      console.log(this.$route.fullPath.indexOf("edit") > 0);
      return this.$route.fullPath.indexOf("edit") > 0;
    },
  },
  data() {
    return {
      stepper: 1,
      breadcrumbs: [
        {
          text: "公告列表",
          disabled: false,
          exact: true,
          to: "/admin/notice",
        },
        {
          text: "创建公告",
          disabled: true,
        },
      ],
      notice: {
        id: "",
        title: "",
        content: "",
        author: "",
        coverImageUrl: "",
      },
      imgUploadLoading: false,
    };
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
    uploadFile(formData) {
      console.log(formData);
      this.$api
        .uploadFile(formData)
        .then((res) => {
          if (res.data.code == 200) {
            this.notice.coverImageUrl = res.data.data;
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
    getNotice(noticeId) {
      this.$api
        .getNotice({
          noticeId: noticeId,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.notice = res.data.data;
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
      this.notice.authorId = sessionStorage.getItem("token");
      this.$api
        .releaseNotice(this.notice)
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
            this.$router.push("/admin/notice");
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
  },
  watch: {
    $route(to, from) {
      console.log(to.path);
      console.log(from.path);
      this.handleIsEdit();
    },
  },
  mounted() {
    if (this.isEdit) {
      this.breadcrumbs[1].text = "修改公告";
      this.getNotice(this.$route.query.noticeId);
    }
  },
};
</script>
