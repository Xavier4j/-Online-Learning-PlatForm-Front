import Vue from "vue";
import App from "./App.vue";
import router from "./routers/router";
import axios from "axios";
import api from "./api/index";
import store from "./store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import moment from "moment/moment";
import Toast from "@/components/Toast";

function showToast({ color, mode, snackbar, text, timeout, x, y }) {
  console.log(123);
  console.log(color + mode + snackbar + text + timeout + x + y);
  const toastComponent = new (Vue.extend(Toast))({
    el: document.createElement("div"),
    data() {
      return {
        color: color,
        mode: mode,
        snackbar: snackbar,
        text: text,
        timeout: timeout,
        x: x,
        y: y,
      };
    },
  }).$mount();
  console.log(123);
  document.body.append(toastComponent.$el);
}

//注册全局方法
Vue.prototype.$toast = showToast;

Vue.filter("DateFormat", function(value, formatString) {
  formatString = formatString || "YYYY-MM-DD HH:mm:ss";
  // return moment(value).format(formatString); // value可以是普通日期 20170723
  if (!value) return "";
  return moment(value).format(formatString);
});

// 引用axios配置文件及接口
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;

// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    // 判断该路由是否需要登录权限
    // console.log("需要登录");
    if (to.matched.some((record) => record.meta.requireAdminAuth)) {
      // 判断该路由是否需要管理员权限
      // console.log("需要管理员");
      if (sessionStorage.role > 0) {
        //判断是否为管理员
        next();
      } else {
        showToast({
          color: "error",
          mode: "",
          snackbar: true,
          text: "进入管理员端需要登录管理员账号",
          timeout: 2000,
          x: "right",
          y: "top",
        });
        next({
          path: "/login",
          query: { redirect: to.fullPath }, // 将跳转的路由path作为参数，登录成功后跳转到该路由
        });
      }
    } else if (sessionStorage.token) {
      console.log("存在token,放行");
      // 判断当前的token是否存在 ； 登录存入的token
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath }, // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  Vuetify,
  render: (h) => h(App),
}).$mount("#app");
