<template>
  <v-container>
    <v-card flat min-height="500" style="background:none">
      <v-row justify="center">
        <v-col cols="12" sm="8">
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="oldPassword"
              type="password"
              :counter="16"
              label="旧密码"
              required
            ></v-text-field>
            <v-text-field
              v-model="newPassword"
              type="password"
              :counter="16"
              label="新密码"
              required
            ></v-text-field>
            <v-text-field
              v-model="repeatPassword"
              type="password"
              :counter="16"
              label="重复新密码"
              required
            ></v-text-field>
          </v-form>
        </v-col>
        <v-col cols="12" sm="8">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" class="mr-4" @click="reset">重置表单</v-btn>
            <v-btn color="warning" @click="submit">提交</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Account",
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      repeatPassword: "",
    };
  },
  computed: {
    ...mapState(["drawer", "token", "avatar"]),
  },
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    submit() {
      if (this.newPassword != this.repeatPassword) {
        this.$toast({
          color: "warning",
          mode: "",
          snackbar: true,
          text: "两次输入密码不一样，请检查！",
          timeout: 2000,
          x: "right",
          y: "top",
        });
        return;
      }
      if (this.oldPassword == this.newPassword) {
        this.$toast({
          color: "warning",
          mode: "",
          snackbar: true,
          text: "旧密码与新密码不能一样，请检查！",
          timeout: 2000,
          x: "right",
          y: "top",
        });
        return;
      }
      this.$api
        .updatePassword({
          userId: this.token,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        })
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
            this.$store.dispatch("LOGOUT");
            this.$router.push({
              path: "/login",
            });
          } else {
            this.$toast({
              color: "warning",
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
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "修改失败，请稍后重试！",
            timeout: 3000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {});
    },
  },
};
</script>
