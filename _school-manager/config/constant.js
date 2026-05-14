// config/constant.js - 常量配置
export default {
  // 应用信息
  APP_NAME: '校园助手',
  APP_VERSION: '1.0.0',
  
  // 存储键名
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER_INFO: 'userInfo',
    THEME: 'theme',
    LANGUAGE: 'language',
    SEARCH_HISTORY: 'searchHistory',
    APP_INITIALIZED: 'appInitialized'
  },
  
  // 活动状态
  ACTIVITY_STATUS: {
    UPCOMING: 'upcoming',      // 即将开始
    ONGOING: 'ongoing',        // 进行中
    ENDED: 'ended',            // 已结束
    CANCELLED: 'cancelled'     // 已取消
  },
  
  // 报名状态
  SIGNUP_STATUS: {
    PENDING: 'pending',        // 待审核
    APPROVED: 'approved',      // 已通过
    REJECTED: 'rejected'       // 已拒绝
  },
  
  // 新闻类型
  NEWS_TYPE: {
    NOTICE: 'notice',          // 通知公告
    NEWS: 'news',              // 校园新闻
    ACTIVITY: 'activity',      // 活动资讯
    ACADEMIC: 'academic'       // 学术动态
  },
  
  // 天气单位
  WEATHER_UNIT: {
    CELSIUS: 'celsius',        // 摄氏度
    FAHRENHEIT: 'fahrenheit'    // 华氏度
  },
  
  // 分页配置
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  },
  
  // 文件上传
  UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024,  // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  
  // 地图配置
  MAP: {
    DEFAULT_ZOOM: 16,
    DEFAULT_CENTER: {
      latitude: 39.9042,
      longitude: 116.4074
    }
  },
  
  // 请求超时时间（毫秒）
  REQUEST_TIMEOUT: 30000,
  
  // 刷新间隔（毫秒）
  REFRESH_INTERVAL: {
    WEATHER: 30 * 60 * 1000,     // 30分钟
    NEWS: 10 * 60 * 1000,        // 10分钟
    ACTIVITY: 5 * 60 * 1000      // 5分钟
  }
}

