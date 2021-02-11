import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      component: () => import("@/views/Login"),
    },
    {
      path: "/",
      component: () => import("@/views/StudentIndex"),
      children: [
        {
          name: "Study",
          path: "/",
          component: () => import("@/views/student/Study"),
        },
        {
          name: "Strengthen",
          path: "strengthen",
          component: () => import("@/views/student/Strengthen"),
        },
        {
          name: "Test",
          path: "test",
          component: () => import("@/views/student/Test"),
        },
        {
          name: "Exam",
          path: "exam",
          component: () => import("@/views/student/Exam"),
        },
        {
          name: "Communicate",
          path: "communicate",
          component: () => import("@/views/student/Communicate"),
        },
        {
          name: "Search",
          path: "search",
          component: () => import("@/views/student/Search"),
        },
        {
          name: "Profile",
          path: "profile",
          component: () => import("@/views/profile/Profile"),
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
          children: [
            {
              name: "Information",
              path: "info",
              component: () => import("@/views/profile/Information"),
            },
            {
              name: "Message",
              path: "message",
              component: () => import("@/views/profile/Message"),
            },
            {
              name: "Account",
              path: "account",
              component: () => import("@/views/profile/Account"),
            },
          ],
        },
      ],
    },
    //以下为管理员端
    {
      path: "/admin",
      component: () => import("@/views/AdminIndex"),
      meta: {
        requireAuth: true, //添加该字段，表示访问该页面需要登录
        requireAdminAuth: true, //添加该字段，表示访问该页面需要登录管理员账号
      },
      children: [
        {
          name: "Home",
          path: "home",
          component: () => import("@/views/admin/Home"),
        },
        {
          name: "Course",
          path: "course",
          component: () => import("@/views/admin/Course"),
        },
        {
          name: "Create Course",
          path: "course/create",
          component: () => import("@/views/admin/CreateCourse"),
        },
        {
          name: "Point",
          path: "point",
          component: () => import("@/views/admin/Point"),
        },
        {
          name: "Paper",
          path: "paper",
          component: () => import("@/views/admin/Paper"),
        },
        {
          name: "Notice",
          path: "notice",
          component: () => import("@/views/admin/Notice"),
        },
        {
          name: "Admin Message",
          path: "message",
          component: () => import("@/views/profile/Message"),
        },
        {
          name: "Admin Profile",
          path: "profile",
          component: () => import("@/views/profile/Information"),
        },
        {
          name: "Admin Account",
          path: "account",
          component: () => import("@/views/profile/Account"),
        },
        {
          path: "*",
          redirect: "home",
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    console.log(to);
    console.log(from);
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});
