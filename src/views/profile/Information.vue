<template>
  <v-container>
    <v-card flat min-height="500" class="ma-10" style="background:none">
      <v-form ref="form" class="pa-3">
        <v-file-input
          ref="upload"
          accept="image/*"
          placeholder="更换头像"
          prepend-icon="mdi-camera"
          dense
          @change="change"
          @click:clear="clear"
        ></v-file-input>
        <v-avatar size="100px" class="ma-3">
          <v-img :src="profile.avatarUrl" />
        </v-avatar>

        <v-text-field
          v-model="profile.nickName"
          :counter="16"
          placeholder="昵称"
          required
        ></v-text-field>

        <v-radio-group label="性别：" row v-model="profile.gender">
          <v-radio label="男" :value="0"></v-radio>
          <v-radio label="女" :value="1"></v-radio>
          <v-radio label="保密" :value="2"></v-radio>
        </v-radio-group>
        <v-textarea
          label="个人简介"
          placeholder="写点什么吧~"
          v-model="profile.note"
          outlined
        ></v-textarea>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" class="mr-2" @click="reset()">重 置</v-btn>

          <v-btn color="warning" @click="save()">保 存</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Information",
  data() {
    return {
      oldProfile: {},
      profile: {},
    };
  },
  methods: {
    change(file) {
      if (!file) {
        return;
      }
      console.log(file.size / 1000);
      if (file.size / 1000 > 1024) {
        this.$toast({
          color: "info",
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
    clear() {
      this.profile.avatarUrl = this.oldProfile.avatarUrl;
    },
    uploadFile(formData) {
      console.log(formData);
      this.$api
        .uploadFile(formData)
        .then((res) => {
          if (res.data.code == 200) {
            this.profile.avatarUrl = res.data.data;
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
    getUserProfile() {
      this.$api
        .getUserProfile({
          userId: sessionStorage.getItem("token"),
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.profile = res.data.data;
            //深拷贝一份对象
            this.oldProfile = JSON.parse(JSON.stringify(this.profile));
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
    reset() {
      this.$refs.upload.reset();
      this.profile = JSON.parse(JSON.stringify(this.oldProfile));
      console.log(this.profile);
    },
    save() {
      this.$api
        .editUserProfile(this.profile)
        .then((res) => {
          if (res.data.code == 200) {
            this.$store.commit("SET_AVATAR", this.profile.avatarUrl);
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
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
            // this.loading = false;
          }, 500);
        });
    },
  },
  created() {
    this.getUserProfile();
  },
};
</script>
