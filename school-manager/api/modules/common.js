// api/modules/common.js
export const commonApi = {
  // 文件上传
  uploadFile: {
    url: '/api/common/upload',
    method: 'POST',
    desc: '文件上传'
  },

  // 图片上传
  uploadImage: {
    url: '/api/common/upload/image',
    method: 'POST',
    desc: '图片上传'
  },

  // 多图上传
  uploadImages: {
    url: '/api/common/upload/images',
    method: 'POST',
    desc: '多图上传'
  },

  // 获取验证码
  getCaptcha: {
    url: '/api/common/captcha',
    method: 'GET',
    desc: '获取验证码'
  },

  // 发送短信验证码
  sendSmsCode: {
    url: '/api/common/sms/send',
    method: 'POST',
    desc: '发送短信验证码'
  },

  // 验证短信验证码
  verifySmsCode: {
    url: '/api/common/sms/verify',
    method: 'POST',
    desc: '验证短信验证码'
  },

  // 获取配置
  getConfig: {
    url: '/api/common/config',
    method: 'GET',
    desc: '获取配置'
  },

  // 反馈
  submitFeedback: {
    url: '/api/common/feedback',
    method: 'POST',
    desc: '提交反馈'
  },

  // 检查更新
  checkUpdate: {
    url: '/api/common/update/check',
    method: 'GET',
    desc: '检查更新'
  },

  // 获取公告
  getAnnouncements: {
    url: '/api/common/announcements',
    method: 'GET',
    desc: '获取公告'
  }
}

// 默认导出
export default commonApi
