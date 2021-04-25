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
          name: "Course Study",
          path: "course/:id",
          component: () => import("@/views/student/Course"),
        },
        {
          name: "Strengthen",
          path: "strengthen",
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
          component: () => import("@/views/student/Strengthen"),
        },
        {
          name: "Test",
          path: "test",
          component: () => import("@/views/student/Test"),
        },
        {
          name: "Test View",
          path: "test/view/:id",
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
          component: () => import("@/views/student/TestView"),
        },
        {
          name: "Test Result",
          path: "test/result/:id",
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
          component: () => import("@/views/student/TestResult"),
        },
        {
          name: "Exam",
          path: "exam",
          component: () => import("@/views/student/Exam"),
        },
        {
          name: "Exam View",
          path: "exam/view/:id",
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
          component: () => import("@/views/student/ExamView"),
        },
        {
          name: "Exam Result",
          path: "exam/result/:id",
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
          component: () => import("@/views/student/ExamResult"),
        },
        {
          name: "Notice",
          path: "notice",
          component: () => import("@/views/student/Notice"),
        },
        {
          name: "Notice",
          path: "notice/view/:id",
          component: () => import("@/views/student/NoticeView"),
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
        // {
        //   name: "Home",
        //   path: "home",
        //   component: () => import("@/views/admin/Home"),
        // },
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
          name: "Edit Course",
          path: "course/edit",
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
          name: "Create Paper",
          path: "paper/create",
          component: () => import("@/views/admin/CreatePaper"),
        },
        {
          name: "Edit Paper",
          path: "paper/edit",
          component: () => import("@/views/admin/CreatePaper"),
        },
        {
          name: "Paper Result",
          path: "paper/result",
          component: () => import("@/views/admin/PaperResult"),
        },
        {
          name: "Grade Paper",
          path: "paper/grade",
          component: () => import("@/views/admin/GradePaper"),
        },
        {
          name: "Question",
          path: "question",
          component: () => import("@/views/admin/Question"),
        },
        {
          name: "Create Question",
          path: "question/create",
          component: () => import("@/views/admin/CreateQuestion"),
        },
        {
          name: "Edit Question",
          path: "question/edit",
          component: () => import("@/views/admin/CreateQuestion"),
        },
        {
          name: "Notice",
          path: "notice",
          component: () => import("@/views/admin/Notice"),
        },
        {
          name: "Create Notice",
          path: "notice/create",
          component: () => import("@/views/admin/CreateNotice"),
        },
        {
          name: "Edit Notice",
          path: "notice/edit",
          component: () => import("@/views/admin/CreateNotice"),
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
          redirect: "course",
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
