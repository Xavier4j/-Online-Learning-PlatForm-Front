<template>
  <v-app id="inspire">
    <v-container
      fluid
      fill-height
      style="background-image:url('https://s3.ax1x.com/2021/01/23/s7zLkT.png')"
    >
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar color="purple" dark flat>
              <v-toolbar-title v-if="isLogin">Login</v-toolbar-title>
              <v-toolbar-title v-else>Signup</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                class="text-capitalize"
                color="orange lighten-2"
                outlined
                @click="isLogin = !isLogin"
                >{{ isLogin ? "Signup" : "Login" }}</v-btn
              >
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Login"
                  name="login"
                  v-model="logInForm.username"
                  prepend-icon="mdi-account"
                  type="text"
                ></v-text-field>
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  v-model="logInForm.password"
                  prepend-icon="mdi-lock"
                  type="password"
                ></v-text-field>

                <v-text-field
                  id="confirmPassword"
                  label="ConfirmPassword"
                  name="confirmPassword"
                  v-model="confirmPassWord"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-if="!isLogin"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="indigo"
                outlined
                class="text-capitalize mr-6 mb-2"
                @click="submit(logInForm)"
                >Submit</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog
      transition="dialog-top-transition"
      v-model="dialog"
      persistent
      max-width="600px"
      style="min-height:500px"
    >
      <template v-slot:default="">
        <v-card>
          <v-toolbar color="primary" dark>选择你要进入的系统</v-toolbar>
          <v-card-text>
            <div class="text-h2 pa-12">
              <v-row style="text-align:center">
                <v-col cols="6">
                  <v-btn color="orange" dark x-large @click="choose(1)">
                    学生端
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn color="error" dark x-large @click="choose(0)">
                    管理端
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      snackbar: false,
      multiLine: true,
      text: "3",
      //isLogin判断是登录还是注册
      isLogin: true,
      logInForm: {
        username: "",
        password: "",
      },
      dialog: false,
      //注册数据
      signUpForm: {
        username: "",
        password: "",
      },
      confirmPassWord: "",
    };
  },
  methods: {
    submit(logInForm) {
      if (this.isLogin) {
        this.logIn(logInForm);
      } else {
        this.signUp(logInForm);
      }
    },
    logIn(logInForm) {
      this.$api
        .logIn(logInForm)
        .then((res) => {
          if (res.data.status) {
            this.$store.dispatch("LOGIN", res.data.data).then(() => {
              if (this.$route.query.redirect) {
                this.$toast({
                  color: "success",
                  mode: "",
                  snackbar: true,
                  text: res.data.msg,
                  timeout: 2000,
                  x: "right",
                  y: "top",
                });
                this.$router.push(this.$route.query.redirect);
              } else if (res.data.data.role > 0) {
                this.dialog = true;
              } else {
                this.$toast({
                  color: "success",
                  mode: "",
                  snackbar: true,
                  text: res.data.msg,
                  timeout: 2000,
                  x: "right",
                  y: "top",
                });
                this.$router.push("/");
              }
            });
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
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "系统异常，请稍后重试！",
            timeout: 3000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {});
    },
    choose(i) {
      this.dialog = false;
      this.$toast({
        color: "success",
        mode: "",
        snackbar: true,
        text: "登录成功,角色为老师！",
        timeout: 2000,
        x: "right",
        y: "top",
      });
      if (i == 0) {
        this.$router.push("/admin/course");
      } else {
        this.$router.push("/");
      }
    },
    signUp(logInForm) {
      if (logInForm.password != this.confirmPassWord) {
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
      this.$api
        .signUp(logInForm)
        .then((res) => {
          if (res.data.status) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
            // this.$store.commit("", val);
            this.$store.dispatch("LOGIN", res.data.data).then(() => {
              if (this.$route.query.redirect) {
                this.$router.push(this.$route.query.redirect);
              } else {
                this.$router.push("/");
              }
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
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "服务器故障了，请稍后重试",
            timeout: 2000,
            x: "right",
            y: "top",
          });
          console.log(err);
        })
        .finally(() => {});
    },
  },
};
</script>
