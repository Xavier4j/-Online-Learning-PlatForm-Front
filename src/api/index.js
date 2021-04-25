import axios from "axios";
axios.defaults.timeout = 100000; // 重新请求时间
axios.defaults.headers.Accept = "application/json";

const UPLOAD_URL = "http://localhost:8090";
const POST_URL = "http://localhost:8090";

// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    sessionStorage.getItem("$_authentication");
    console.log(`${new Date().getHours()}:${new Date().getMinutes()}`);
    console.log(config);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error(error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    console.log(`${new Date().getHours()}:${new Date().getMinutes()}`);
    console.log(response);
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    console.error(error);
    console.error(error.request);
    return Promise.reject(error.request);
  }
);

export default {
  /**
   * 上传文件
   * @param {*} params
   */
  uploadFile(data) {
    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return axios.post(`${UPLOAD_URL}/upload`, data, config);
  },
  /**
   * 登陆并获取用户信息
   * @param {*} params
   */
  logIn(params) {
    return axios.post(`${POST_URL}/user/login`, params);
  },
  /**
   * 注册并获取用户信息
   * @param {*} params
   */
  signUp(params) {
    return axios.post(`${POST_URL}/user/signup`, params);
  },
  /**
   * 修改密码
   * @param {*} params
   */
  updatePassword(params) {
    return axios.get(`${POST_URL}/user/update`, { params: params });
  },
  /**
   * 查询用户信息
   * @param {*} params
   */
  getUserProfile(params) {
    return axios.get(`${POST_URL}/profile/select`, { params: params });
  },
  /**
   * 修改用户信息
   * @param {*} params
   */
  editUserProfile(params) {
    return axios.post(`${POST_URL}/profile/update`, params);
  },
  /**
   * 搜索课程列表（分页）
   * @param {*} params
   */
  searchCourseList(params) {
    return axios.get(`${POST_URL}/course/search`, { params: params });
  },
  /**
   * 查询课程内容
   * @param {*} params
   */
  getCourse(params) {
    return axios.get(`${POST_URL}/course/select`, { params: params });
  },
  /**
   * 获取评论列表
   * @param {*} params
   */
  getCommentList(params) {
    return axios.get(`${POST_URL}/comment/select`, { params: params });
  },
  /**
   * 评论
   * @param {*} params
   */
  sendComment(params) {
    return axios.post(`${POST_URL}/comment/send`, params);
  },
  /**
   * 回复
   * @param {*} params
   */
  sendReply(params) {
    return axios.post(`${POST_URL}/reply/send`, params);
  },
  /**
   * 获取未读消息数量
   * @param {*} params
   */
  getMessageCount(params) {
    return axios.get(`${POST_URL}/message/count`, { params: params });
  },
  /**
   * 获取消息列表
   * @param {*} params
   */
  getMessageList(params) {
    return axios.get(`${POST_URL}/message/select`, { params: params });
  },
  /**
   * 获取消息列表
   * @param {*} params
   */
  updateMessage(params) {
    return axios.post(`${POST_URL}/message/update`, params);
  },
  /**
   * 获取错误记录列表
   * @param {*} params
   */
  getWrongRecordList(params) {
    return axios.get(`${POST_URL}/wrong-record/select`, { params: params });
  },

  //以下为管理员端接口
  /**
   * 发布课程
   * @param {*} params
   */
  releaseCourse(params) {
    return axios.post(`${POST_URL}/course/create`, params);
  },
  /**
   * 修改课程
   * @param {*} params
   */
  updateCourse(params) {
    return axios.get(`${POST_URL}/course/update`, { params: params });
  },
  /**
   * 删除课程
   * @param {*} params
   */
  deleteCourse(params) {
    return axios.get(`${POST_URL}/course/delete`, { params: params });
  },
  /**
   * 获取知识点列表
   * @param {*} params
   */
  getPointList(params) {
    return axios.get(`${POST_URL}/point/selectAll`, { params: params });
  },
  /**
   * 新增知识点
   * @param {*} params
   */
  savePoint(params) {
    return axios.post(`${POST_URL}/point/create`, params);
  },
  /**
   * 获取试卷
   * @param {*} params
   */
  getPaper(params) {
    return axios.get(`${POST_URL}/paper/select`, { params: params });
  },
  /**
   * 获取试卷列表
   * @param {*} params
   */
  getPaperList(params) {
    return axios.get(`${POST_URL}/paper/search`, { params: params });
  },
  /**
   * 发布试卷
   * @param {*} params
   */
  releasePaper(params) {
    return axios.post(`${POST_URL}/paper/create`, params);
  },
  /**
   * 获取答卷结果列表
   * @param {*} params
   */
  getPaperResultList(params) {
    return axios.get(`${POST_URL}/paper/result-list`, { params: params });
  },
  /**
   * 导出答卷结果列表
   * @param {*} params
   */
  exportResultList(params) {
    return axios.get(`${POST_URL}/paper/export`, { params: params });
  },
  /**
   * 修改试卷
   * @param {*} params
   */
  updatePaper(params) {
    return axios.post(`${POST_URL}/paper/update`, params);
  },
  /**
   * 删除试卷
   * @param {*} params
   */
  deletePaper(params) {
    return axios.get(`${POST_URL}/paper/delete`, { params: params });
  },
  /**
   * 提交答案
   * @param {*} params
   */
  releaseAnswerList(params) {
    return axios.post(`${POST_URL}/answer/insertBatch`, params);
  },

  /**
   * 提交答案
   * @param {*} params
   */
  gradeAnswer(params) {
    return axios.get(`${POST_URL}/answer/grade`, { params: params });
  },
  /**
   * 获取考试结果
   * @param {*} params
   */
  getPaperResult(params) {
    return axios.get(`${POST_URL}/paper/result`, { params: params });
  },
  /**
   * 获取题目列表
   * @param {*} params
   */
  getQuestion(params) {
    return axios.get(`${POST_URL}/question/selectById`, { params: params });
  },
  /**
   * 获取题目列表
   * @param {*} params
   */
  getQuestionList(params) {
    return axios.get(`${POST_URL}/question/selectAll`, { params: params });
  },
  /**
   * 根据条件随机获取一个题目
   * @param {*} params
   */
  getQuestionRandom(params) {
    return axios.get(`${POST_URL}/question/selectOneRandom`, {
      params: params,
    });
  },
  /**
   * 新增题目
   * @param {*} params
   */
  saveQuestion(params) {
    return axios.post(`${POST_URL}/question/create`, params);
  },
  /**
   * 删除题目
   * @param {*} params
   */
  deleteQuestion(params) {
    return axios.get(`${POST_URL}/question/delete`, { params: params });
  },
  /**
   * 获取公告列表
   * @param {*} params
   */
  searchNoticeList(params) {
    return axios.get(`${POST_URL}/notice/search`, { params: params });
  },
  /**
   * 发布公告
   * @param {*} params
   */
  releaseNotice(params) {
    return axios.post(`${POST_URL}/notice/create`, params);
  },
  /**
   * 获取公告
   * @param {*} params
   */
  getNotice(params) {
    return axios.get(`${POST_URL}/notice/select`, { params: params });
  },
  /**
   * 修改公告
   * @param {*} params
   */
  updateNotice(params) {
    return axios.post(`${POST_URL}/notice/update`, params);
  },
  /**
   * 删除公告
   * @param {*} params
   */
  deleteNotice(params) {
    return axios.get(`${POST_URL}/notice/delete`, { params: params });
  },
};
