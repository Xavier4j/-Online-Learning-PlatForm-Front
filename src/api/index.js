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
   * 获取评论列表
   * @param {*} params
   */
  getPostCommentList(params) {
    return axios.get(`${POST_URL}/get-comment`, { params: params });
  },
  /**
   * 发布帖子
   * @param {*} params
   */
  createPost(params) {
    return axios.post(`${POST_URL}/post`, params);
  },
  /**
   * 编辑帖子
   * @param {*} params
   */
  editPost(params) {
    return axios.post(`${POST_URL}/update-post`, params);
  },
  /**
   * 评论
   * @param {*} params
   */
  sendComment(params) {
    return axios.post(`${POST_URL}/comment`, params);
  },
  /**
   * 置顶评论
   * @param {*} params
   */
  stickComment(params) {
    return axios.get(`${POST_URL}/stick-comment`, { params: params });
  },
  /**
   * 删除评论
   * @param {*} params
   */
  deleteComment(params) {
    return axios.get(`${POST_URL}/delete-comment`, { params: params });
  },
  /**
   * 回复
   * @param {*} params
   */
  sendReply(params) {
    return axios.post(`${POST_URL}/reply`, params);
  },
  /**
   * 删除回复
   * @param {*} params
   */
  deleteReply(params) {
    return axios.get(`${POST_URL}/delete-reply`, { params: params });
  },
  /**
   * 获取未读消息数量
   * @param {*} params
   */
  getMessageCount(params) {
    return axios.get(`${POST_URL}/count-message`, { params: params });
  },
  /**
   * 获取消息列表
   * @param {*} params
   */
  getMessageList(params) {
    return axios.get(`${POST_URL}/select-message`, { params: params });
  },
  /**
   * 修改留言
   * @param {*} params
   */
  updateMessage(params) {
    return axios.get(`${POST_URL}/update-message`, { params: params });
  },
  /**
   * 删除留言
   * @param {*} params
   */
  deleteMessage(params) {
    return axios.get(`${POST_URL}/delete-message`, { params: params });
  },

  //以下为管理员端接口

  /**
   * 获取论坛整体情感倾向分析
   * @param {*} params
   */
  getSentitiveAnalysis(params) {
    return axios.get(`${POST_URL}/analyse-whole-sentiment`, { params: params });
  },
  /**
   * 获取热门话题分析
   * @param {*} params
   */
  getTopicAnalysis(params) {
    return axios.get(`${POST_URL}/analyse-topic`, { params: params });
  },
  /**
   * 获取论坛热点分析
   * @param {*} params
   */
  getKeywordAnalysis(params) {
    return axios.get(`${POST_URL}/analyse-keyword`, { params: params });
  },
  /**
   * 获取论坛负面消息排行
   * @param {*} params
   */
  getNegativeAnalysis(params) {
    return axios.get(`${POST_URL}/analyse-negative`, { params: params });
  },
  /**
   * 通过Tag获取帖子列表
   * @param {*} params
   */
  getPostListByTag(params) {
    return axios.get(`${POST_URL}/select-post-keyword`, { params: params });
  },
  /**
   * 获取热门帖子列表
   * @param {*} params
   */
  getHotPostList(params) {
    return axios.get(`${POST_URL}/select-hot`, { params: params });
  },
  /**
   * 获取用户列表
   * @param {*} params
   */
  getUserList(params) {
    return axios.get(`${POST_URL}/select-user`, { params: params });
  },
  /**
   * 修改用户
   * @param {*} params
   */
  updateUser(params) {
    return axios.post(`${POST_URL}/update-user`, params);
  },
  /**
   * 获取模块列表
   * @param {*} params
   */
  getPlateList(params) {
    return axios.get(`${POST_URL}/select-plate`, { params: params });
  },
  /**
   * 修改模块
   * @param {*} params
   */
  updatePlate(params) {
    return axios.post(`${POST_URL}/update-plate`, params);
  },
  /**
   * 获取版主列表
   * @param {*} params
   */
  getModeratorList(params) {
    return axios.get(`${POST_URL}/select-moderator`, { params: params });
  },
  /**
   * 修改版主
   * @param {*} params
   */
  updateModerator(params) {
    return axios.post(`${POST_URL}/update-moderator`, params);
  },
  /**
   * 删除版主
   * @param {*} params
   */
  deleteModerator(params) {
    return axios.get(`${POST_URL}/delete-moderator`, { params: params });
  },
  /**
   * 获取申请列表
   * @param {*} params
   */
  getApplyList(params) {
    return axios.get(`${POST_URL}/select-apply`, { params: params });
  },
  /**
   * 修改申请
   * @param {*} params
   */
  updateApply(params) {
    return axios.get(`${POST_URL}/update-apply`, { params: params });
  },
  /**
   * 删除申请
   * @param {*} params
   */
  deleteApply(params) {
    return axios.get(`${POST_URL}/delete-apply`, { params: params });
  },
  /**
   * 获取敏感词过滤列表
   * @param {*} params
   */
  getFilterList(params) {
    return axios.get(`${POST_URL}/select-filter`, { params: params });
  },
};
