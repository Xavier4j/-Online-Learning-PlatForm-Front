<template>
  <v-container>
    <v-card
      flat
      :loading="messageLoading"
      min-height="500"
      style="background:none"
    >
      <v-alert outlined color="cyan" v-if="total === 0" border="left"
        >你没有任何消息！</v-alert
      >
      <v-row class="ma-2">
        <v-col cols="12" v-for="(message, index) in messageList" :key="index">
          <v-alert
            outlined
            prominent
            icon="mdi-message-text"
            :color="message.status == 1 ? 'grey lighten-1' : 'primary'"
            v-if="message.type == 1"
          >
            <v-row align="center">
              <v-col class="grow">
                <strong>评论消息：</strong>用户
                <strong>{{ message.senderProfile.nickname }}</strong>
                在帖子
                <v-chip
                  color="primary"
                  outlined
                  @click="toPostView(message.postId)"
                  >{{ message.postTitle }}</v-chip
                >
                下评论了你：
                {{ message.content }}
              </v-col>
              <v-col class="shrink">
                <v-btn
                  text
                  color="blue-grey"
                  :disabled="message.status == 1"
                  @click="readMessage(message.id)"
                  >{{ message.status == 1 ? "已读" : "标记为已读" }}</v-btn
                >
              </v-col>
              <v-col class="shrink">
                <v-btn
                  text
                  class="error--text"
                  @click="deleteMessage(message.id)"
                  >删除</v-btn
                >
              </v-col>
            </v-row>
          </v-alert>
          <v-alert
            outlined
            prominent
            icon="mdi-message-minus"
            :color="message.status == 1 ? 'grey lighten-1' : 'cyan'"
            v-else-if="message.type == 2"
          >
            <v-row align="center">
              <v-col class="grow">
                <strong>回复消息：</strong>用户
                <strong>{{ message.senderProfile.nickname }}</strong>
                在帖子
                <v-chip
                  color="cyan"
                  outlined
                  @click="toPostView(message.postId)"
                  >{{ message.postTitle }}</v-chip
                >
                下回复了你：
                {{ message.content }}
              </v-col>
              <v-col class="shrink">
                <v-btn
                  text
                  color="blue-grey"
                  :disabled="message.status == 1"
                  @click="readMessage(message.id)"
                  >{{ message.status == 1 ? "已读" : "标记为已读" }}</v-btn
                >
              </v-col>
              <v-col class="shrink">
                <v-btn
                  text
                  class="error--text"
                  @click="deleteMessage(message.id)"
                  >删除</v-btn
                >
              </v-col>
            </v-row>
          </v-alert>
          <v-alert
            outlined
            prominent
            icon="mdi-message-cog"
            :color="message.status == 1 ? 'grey lighten-1' : 'error'"
            v-else
          >
            <v-row align="center">
              <v-col class="grow">
                <strong>系统消息：</strong>
                {{ message.content }}
              </v-col>
              <v-col class="shrink">
                <v-btn
                  text
                  color="blue-grey"
                  :disabled="message.status == 1"
                  @click="readMessage(message.id)"
                  >{{ message.status == 1 ? "已读" : "标记为已读" }}</v-btn
                >
              </v-col>
              <v-col class="shrink">
                <v-btn
                  text
                  class="error--text"
                  @click="deleteMessage(message.id)"
                  >删除</v-btn
                >
              </v-col>
            </v-row>
          </v-alert>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Message",
  data() {
    return {
      messageLoading: false,
      messageList: [],
      total: 0,
      pageNum: 1,
      pageSize: 18,
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER",
    }),
    toPostView(id) {
      this.$router.push({
        path: "post",
        query: {
          id: id,
        },
      });
      this.setDrawer(false);
    },
    getMessageList() {
      this.messageLoading = true;
      this.$api
        .getMessageList({
          receiver: this.token,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.messageList = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          // this.$message.error("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          this.messageLoading = false;
        });
    },
    readMessage(id) {
      this.$api
        .updateMessage({
          id: id,
          status: 1,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.getMessageList();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    deleteMessage(id) {
      this.$api
        .deleteMessage({
          id: id,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.getMessageList();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
  },
  mounted() {
    // this.getMessageList();
  },
};
</script>
