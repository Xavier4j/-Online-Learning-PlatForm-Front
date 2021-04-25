<template>
  <v-container>
    <v-row class="mx-2 my-2">
      <p style="font-size: 20px; word-wrap: break-word; margin: 15px 0">
        {{ notice.title }}
      </p>
      <v-spacer></v-spacer>
      <v-chip color="cyan" outlined>作者：{{ notice.author.nickName }}</v-chip>
    </v-row>

    <v-divider></v-divider>
    <v-card
      class="my-3"
      style="background: none"
      flat
      :loading="contentLoading"
    >
      <mavon-editor
        v-model="notice.content"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        codeStyle="vs2015"
        style="z-index: 1"
      />
    </v-card>
    <Discussion :belongId="this.$route.params.id" />
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
  name: "NoticeView",
  components: {
    Discussion: () => import("@/components/Discussion"),
  },
  data() {
    return {
      contentLoading: false,
      notice: {
        author: {
          nickName: "",
        },
      },
    };
  },
  methods: {
    getNotice(id) {
      this.contentLoading = true;
      this.$api
        .getNotice({ noticeId: id })
        .then((res) => {
          if (res.data.code == 200) {
            this.notice = res.data.data;
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
            text: "系统异常，请稍后重试！",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.contentLoading = false;
          }, 200);
        });
    },
  },
  mounted() {
    this.getNotice(this.$route.params.id);
  },
};
</script>
