// api/modules/user.js
export const userApi = {
  // 登录注册
  login: {
    url: '/api/user/login',
    method: 'POST',
    desc: '用户登录'
  },

  register: {
    url: '/api/user/register',
    method: 'POST',
    desc: '用户注册'
  },

  // 用户信息
  getUserInfo: {
    url: '/api/user/info',
    method: 'GET',
    desc: '获取用户信息'
  },

  updateUserInfo: {
    url: '/api/user/update',
    method: 'POST',
    desc: '更新用户信息'
  },

  // 头像上传
  uploadAvatar: {
    url: '/api/user/avatar',
    method: 'POST',
    desc: '上传头像'
  },

  // 密码管理
  changePassword: {
    url: '/api/user/password',
    method: 'POST',
    desc: '修改密码'
  },

  resetPassword: {
    url: '/api/user/password/reset',
    method: 'POST',
    desc: '重置密码'
  },

  // 绑定解绑
  bindPhone: {
    url: '/api/user/bind/phone',
    method: 'POST',
    desc: '绑定手机'
  },

  unbindPhone: {
    url: '/api/user/unbind/phone',
    method: 'POST',
    desc: '解绑手机'
  },

  // 实名认证
  realNameAuth: {
    url: '/api/user/auth/realname',
    method: 'POST',
    desc: '实名认证'
  },

  // 消息通知
  getNotifications: {
    url: '/api/user/notifications',
    method: 'GET',
    desc: '获取通知'
  },

  readNotification: {
    url: '/api/user/notification/read',
    method: 'POST',
    desc: '标记已读'
  },

  // 我的活动
  getMyActivities: {
    url: '/api/user/activities',
    method: 'GET',
    desc: '我的活动'
  },

  // 我的资讯
  getMyNews: {
    url: '/api/user/news',
    method: 'GET',
    desc: '我的资讯'
  },

  // 我的收藏
  getMyFavorites: {
    url: '/api/user/favorites',
    method: 'GET',
    desc: '我的收藏'
  },

  // 退出登录
  logout: {
    url: '/api/user/logout',
    method: 'POST',
    desc: '用户登出'
  },

  // 账号注销
  deleteAccount: {
    url: '/api/user/delete',
    method: 'POST',
    desc: '注销账号'
  }
}

// 默认导出
export default userApi
