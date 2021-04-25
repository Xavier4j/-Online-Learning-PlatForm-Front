<template>
  <v-container>
    <v-card class="my-3" flat>
      <v-textarea
        ref="textarea"
        v-model="comment"
        :label="commentLable"
        color="orange"
        hide-details
        auto-grow
        outlined
        row-height="25"
        @focus="comentBtnHidden = false"
      ></v-textarea>
      <v-row class="mx-1 my-2">
        <v-spacer></v-spacer>
        <v-btn
          class="mr-3 text-capitalize"
          color="secondary"
          v-if="isReply"
          outlined
          dark
          @click="cancleReply()"
          >取消回复</v-btn
        >
        <v-btn
          color="orange"
          v-if="!comentBtnHidden"
          outlined
          class="text-capitalize"
          dark
          @click="handle()"
          >发表评论</v-btn
        >
      </v-row>
    </v-card>
    <v-card class="my-3" flat>
      <v-card-title>评论列表：</v-card-title>
      <v-alert type="info" v-if="commentList.length == 0">
        还没有人来评论，快来抢沙发！
      </v-alert>
      <v-card
        flat
        v-for="(comment, index) in commentList"
        :key="index"
        class="my-2"
      >
        <v-card-text>
          <v-row class="mb-4" align="center">
            <v-avatar color="grey" size="40px" class="mx-2">
              <v-img :src="comment.reviewerProfile.avatarUrl" />
            </v-avatar>
            <span class="mr-2" style="font-size:14px;color:#454545">
              {{ comment.reviewerProfile.nickName }}
              <v-chip
                class="mx-2"
                small
                color="error"
                v-if="comment.reviewerProfile.role > 0"
              >
                老师
              </v-chip>
            </span>
            <span class="ml-3" style="font-size:10px">{{
              comment.createTime | DateFormat
            }}</span>
            <v-spacer></v-spacer>
            <v-btn
              small
              text
              color="primary"
              @click="
                beforeReply(
                  comment.id,
                  comment.reviewerProfile.nickName,
                  comment.reviewerId
                )
              "
              >回复</v-btn
            >
          </v-row>
          <p style="font-size:16px;color:#000" class="ml-11">
            {{ comment.content }}
          </p>
          <v-card
            flat
            v-for="(reply, index) in comment.replyList"
            :key="index"
            class="my-2 ml-11"
          >
            <v-card-text class="pa-0">
              <v-row class="mb-4" align="center">
                <v-avatar color="grey" size="40px" class="mx-2">
                  <v-img :src="reply.reviewerProfile.avatarUrl" />
                </v-avatar>
                <span class="mr-2" style="font-size:14px;color:#454545">{{
                  reply.reviewerProfile.nickName
                }}</span>
                <span class="ml-3" style="font-size:10px">{{
                  reply.createTime | DateFormat
                }}</span>
                <v-spacer></v-spacer>
                <v-btn
                  small
                  text
                  color="primary"
                  @click="
                    beforeBeforeReply(
                      comment.id,
                      reply.reviewerProfile.nickName,
                      reply.reviewerId
                    )
                  "
                  >回复</v-btn
                >
              </v-row>
              <p style="font-size:16px;color:#000">{{ reply.content }}</p>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
    </v-card>
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
  name: "Discussion",
  props: ["belongId"],
  data: () => ({
    commentsLoading: false,
    //评论列表
    commentList: [],
    //评论
    commentLable: "评论一下",
    comment: "",
    comentBtnHidden: true,
    //回复
    isReply: false,
    recipient: "",
    recipientId: "",
    commentId: "",
    //评论分页
    current: 1,
    size: 10,
    //总页数
    pages: 0,
  }),
  methods: {
    getCommentList() {
      this.commentsLoading = true;
      this.$api
        .getCommentList({
          belongId: this.belongId,
          current: this.current,
          size: this.size,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.commentList = res.data.data.records;
            this.pages = res.data.data.pages;
          } else {
            console.log("评论信息加载失败，请稍后重试！");
          }
        })
        .catch((err) => {
          console.log("评论信息加载失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {
          this.commentsLoading = false;
        });
    },
    handle() {
      if (this.isReply) {
        this.sendReply();
      } else {
        this.sendComment();
      }
    },
    sendComment() {
      if (this.comment == null || this.comment.length == 0) {
        return;
      }
      //   console.log("需要登录");
      if (!sessionStorage.token) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath }, // 将跳转的路由path作为参数，登录成功后跳转到该路由
        });
        return;
      }
      this.$api
        .sendComment({
          belongId: this.belongId,
          reviewerId: sessionStorage.getItem("token"),
          content: this.comment,
        })
        .then((res) => {
          if (res.data.code == 200) {
            console.log("评论成功！");
            this.comment = "";
            this.getCommentList();
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 3000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          console.log("评论失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {
          this.commentsLoading = false;
        });
    },
    beforeReply(commentId, recipient, recipientId) {
      this.commentLable = "回复：" + recipient;
      this.commentId = commentId;
      this.recipient = recipient;
      this.recipientId = recipientId;
      console.log(this.recipientId);
      this.isReply = true;
      this.$refs.textarea.focus();
    },
    cancleReply() {
      this.commentLable = "评论一下";
      this.comment = "";
      this.isReply = false;
    },
    //楼中楼回复处理
    beforeBeforeReply(commentId, recipient, recipientId) {
      this.comment = "@" + recipient + " ";
      this.beforeReply(commentId, recipient, recipientId);
    },
    sendReply() {
      if (this.comment == null || this.comment.length == 0) {
        return;
      }
      console.log("需要登录");
      if (!sessionStorage.token) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath }, // 将跳转的路由path作为参数，登录成功后跳转到该路由
        });
        return;
      }
      this.$api
        .sendReply({
          commentId: this.commentId,
          reviewerId: sessionStorage.getItem("token"),
          recipientId: this.recipientId,
          content: this.comment,
        })
        .then((res) => {
          if (res.data.code == 200) {
            console.log("回复成功！");
            this.comment = "";
            this.getCommentList();
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 3000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          console.log("回复失败，请稍后重试！");
          console.log(err);
        })
        .finally(() => {
          this.commentsLoading = false;
        });
    },
    changePage(page) {
      console.log(page);
      this.getCommentList();
    },
  },
  mounted() {
    console.log(this.belongId);
    this.getCommentList();
  },
};
</script>
