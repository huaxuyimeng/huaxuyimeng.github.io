// api/modules/system.js
export const systemApi = {
  // 系统信息
  getSystemInfo: {
    url: '/api/system/info',
    method: 'GET',
    desc: '获取系统信息'
  },

  // 系统配置
  getSystemConfig: {
    url: '/api/system/config',
    method: 'GET',
    desc: '获取系统配置'
  },

  // 更新系统配置
  updateSystemConfig: {
    url: '/api/system/config',
    method: 'POST',
    desc: '更新系统配置'
  },

  // 日志
  getLogs: {
    url: '/api/system/logs',
    method: 'GET',
    desc: '获取日志'
  },

  // 统计数据
  getStatistics: {
    url: '/api/system/statistics',
    method: 'GET',
    desc: '获取统计数据'
  },

  // 用户统计
  getUserStatistics: {
    url: '/api/system/statistics/users',
    method: 'GET',
    desc: '获取用户统计'
  },

  // 活动统计
  getActivityStatistics: {
    url: '/api/system/statistics/activities',
    method: 'GET',
    desc: '获取活动统计'
  },

  // 新闻统计
  getNewsStatistics: {
    url: '/api/system/statistics/news',
    method: 'GET',
    desc: '获取新闻统计'
  }
}

// 默认导出
export default systemApi
