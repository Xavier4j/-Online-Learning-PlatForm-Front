<template>
  <v-container>
    <v-chip class="ma-2" color="red" v-if="isEdit" text-color="white">编辑模式</v-chip>
    <v-stepper v-model="step" vertical>
      <template>
        <v-stepper-step :complete="step > 1" step="1" editable>
          编写帖子内容
          <small>使用markdown语法编写</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <mavon-editor
            ref="md"
            v-model="post.content"
            codeStyle="vs2015"
            :ishljs="true"
            style="height:85vh;z-index: 1;border: 1px solid #d2d2d2;margin-bottom:20px;"
            @imgAdd="$imgAdd"
          />
          <v-btn color="success" @click="nextStep()" style="margin-right:10px">下一步</v-btn>
          <v-btn color="warning" @click="cancle()">取消</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="step > 2" step="2">
          填写帖子信息
          <small>Summarize if needed</small>
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-form ref="form" lazy-validation>
            <v-text-field v-model="post.title" :counter="32" label="标题" required></v-text-field>

            <v-text-field v-model="post.summary" label="简述" required></v-text-field>

            <v-select
              v-model="post.plateId"
              :items="plateList"
              item-text="title"
              item-value="id"
              label="所属板块"
              required
            ></v-select>
          </v-form>

          <v-btn color="primary" @click="lastStep()" style="margin-right:10px">上一步</v-btn>
          <v-btn color="success" @click="nextStep()" style="margin-right:10px">下一步</v-btn>
          <v-btn color="warning" @click="cancle()">取消</v-btn>
          <!-- <v-btn color="primary" @click="nextStep()">存入草稿</v-btn> -->
          <!-- <v-btn text>取消</v-btn> -->
        </v-stepper-content>

        <v-stepper-step :complete="step > 3" step="3">
          选择帖子封面
          <small>建议比例16：9</small>
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-file-input
            ref="upload"
            accept="image/*"
            placeholder="选择头像"
            prepend-icon="mdi-camera"
            outlined
            show-size
            dense
            @change="change"
            @click:clear="clear"
          ></v-file-input>
          <v-text-field v-model="post.imageUrl" label="封面图片Url" required></v-text-field>
          <v-img class="mb-3" width="320" :src="post.imageUrl" v-if="post.imageUrl" aspect-ratio></v-img>

          <v-btn color="primary" @click="lastStep()" style="margin-right:10px">上一步</v-btn>
          <v-btn color="success" @click="handle()" style="margin-right:10px">完成</v-btn>
          <v-btn color="warning" @click="cancle()">取消</v-btn>
          <!-- <v-btn color="primary" @click="nextStep()">存入草稿</v-btn> -->
          <!-- <v-btn text>取消</v-btn> -->
        </v-stepper-content>
      </template>
    </v-stepper>
  </v-container>
</template>

<script>
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import "mavon-editor/dist/highlightjs/highlight.min.js";
import global from "@/assets/global";
import Vue from "vue";
// use
Vue.use(mavonEditor);
export default {
  name: "PostView",
  data() {
    return {
      isEdit: false,
      post: {
        id: "",
        title: "",
        content: "",
        summary: "",
        author: "",
        imageUrl: "",
        plateId: "",
        subject: ""
      },
      plateList: global.plateList1,
      value: "",
      step: 1
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
          y: "top"
        });
        this.$refs.md.$refs.toolbar_left.$imgDelByFilename($file.name);
        return;
      }
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("uploadFile", $file);
      this.$api
        .uploadFile(formdata)
        .then(res => {
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
        .catch(err => {
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
          y: "top"
        });
        return;
      }
      console.log(file);
      let formData = new FormData();
      formData.append("uploadFile", file);
      this.uploadFile(formData);
    },
    clear() {
      this.post.imageUrl = "";
    },
    uploadFile(formData) {
      console.log(formData);
      this.$api
        .uploadFile(formData)
        .then(res => {
          if (res.data.code == 200) {
            this.post.imageUrl = res.data.data;
            console.log("成功");
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch(err => {
          console.log("获取数据失败！");
          console.log(err);
        });
    },
    handle() {
      if (this.isEdit) {
        console.log("修改");
        this.editPost();
      } else {
        console.log("新增");
        this.sendPost();
      }
    },
    editPost() {
      this.$api
        .editPost(this.post)
        .then(res => {
          if (res.data.code == 200) {
            console.log("编辑成功！");
            this.$router.push({
              path: "post?id=" + this.post.id
            });
          } else {
            console.log("编辑失败，请稍后重试！");
          }
        })
        .catch(err => {
          console.log("编辑失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {});
    },
    sendPost() {
      this.post.author = sessionStorage.getItem("token");
      this.$api
        .createPost(this.post)
        .then(res => {
          if (res.data.code == 200) {
            console.log("发帖成功！");
            let id = res.data.data;
            console.log(id);
            this.$router.push({
              path: "post?id=" + id
            });
          } else {
            console.log("发帖失败，请稍后重试！");
          }
        })
        .catch(err => {
          console.log("发帖失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {});
    },
    getPostContent(id) {
      this.commentsLoading = true;
      this.$api
        .getPostContent({ postId: id })
        .then(res => {
          if (res.data.code == 200) {
            let postData = res.data.data;
            this.post.title = postData.title;
            this.post.content = postData.content;
            this.post.summary = postData.summary;
            this.post.author = postData.author;
            this.post.imageUrl = postData.imageUrl;
            this.post.plateId = postData.plateId;
            this.post.subject = postData.subject;
          } else {
            this.$message.error("博客加载失败，请稍后重试！");
          }
        })
        .catch(err => {
          this.$message.error("博客加载失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            this.contentLoading = false;
          }, 200);
        });
    },
    lastStep() {
      this.step--;
    },
    nextStep() {
      this.step++;
    },
    cancle() {
      this.$router.go(-1);
    },
    handleIsEdit() {
      if (this.$route.query.id) {
        // console.log("id 存在");
        this.isEdit = true;
        this.post.id = this.$route.query.id;
        this.getPostContent(this.$route.query.id);
      } else {
        // console.log("id 不存在");
        this.isEdit = false;
        this.post = {
          id: "",
          title: "",
          content: "",
          summary: "",
          author: "",
          imageUrl: "",
          plateId: "",
          subject: ""
        };
      }
    }
  },
  watch: {
    $route(to, from) {
      console.log(to.path);
      console.log(from.path);
      this.handleIsEdit();
    }
  },
  mounted() {
    this.handleIsEdit();
  }
};
</script>
