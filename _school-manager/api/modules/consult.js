// api/modules/consult.js
export const consultApi = {
  // 发送消息
  sendMessage: {
    url: '/api/consult/message',
    method: 'POST',
    desc: '发送消息'
  },

  // 获取消息历史
  getMessageHistory: {
    url: '/api/consult/messages',
    method: 'GET',
    desc: '获取消息历史'
  },

  // 创建会话
  createSession: {
    url: '/api/consult/session',
    method: 'POST',
    desc: '创建会话'
  },

  // 获取会话列表
  getSessions: {
    url: '/api/consult/sessions',
    method: 'GET',
    desc: '获取会话列表'
  },

  // 删除会话
  deleteSession: {
    url: '/api/consult/session',
    method: 'DELETE',
    desc: '删除会话'
  },

  // 清空会话
  clearSession: {
    url: '/api/consult/session/clear',
    method: 'POST',
    desc: '清空会话'
  },

  // 获取快速问题
  getQuickQuestions: {
    url: '/api/consult/questions',
    method: 'GET',
    desc: '获取快速问题'
  },

  // 获取知识库
  getKnowledge: {
    url: '/api/consult/knowledge',
    method: 'GET',
    desc: '获取知识库'
  },

  // 反馈
  submitFeedback: {
    url: '/api/consult/feedback',
    method: 'POST',
    desc: '提交反馈'
  },

  // 设置
  getSettings: {
    url: '/api/consult/settings',
    method: 'GET',
    desc: '获取设置'
  },

  updateSettings: {
    url: '/api/consult/settings',
    method: 'POST',
    desc: '更新设置'
  }
}

// 默认导出
export default consultApi
