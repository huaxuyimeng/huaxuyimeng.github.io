// config/router.js - 路由配置
export default {
  // 页面路径映射
  pages: {
    // 首页
    HOME: '/pages/tabbar/index/index',
    INDEX: '/pages/index/index',

    // TabBar页面
    TABBAR: {
      HOME: '/pages/tabbar/index/index',
      ACTIVITY: '/pages/tabbar/activity/index',
      NEWS: '/pages/tabbar/news/index',
      FUNCTION: '/pages/tabbar/function/index',
      PROFILE: '/pages/tabbar/profile/index',
      CONSULT: '/pages/tabbar/consult/index'
    },

    // 活动相关
    ACTIVITY: {
      LIST: '/pages/tabbar/activity/index',
      DETAIL: '/pages/tabbar/activity/subpages/detail/index',
      CREATE: '/pages/tabbar/activity/subpages/create/index',
      MY: '/pages/tabbar/activity/subpages/my/index'
    },

    // 新闻相关
    NEWS: {
      LIST: '/pages/tabbar/news/index',
      DETAIL: '/pages/tabbar/news/subpages/detail/index'
    },

    // 功能相关
    FUNCTION: {
      CALENDAR: '/pages/tabbar/function/subpages/calendar/index',
      CANTEEN: '/pages/tabbar/function/subpages/canteen/index',
      LIBRARY: '/pages/tabbar/function/subpages/library/index',
      MAP: '/pages/tabbar/function/subpages/map/index',
      WEATHER: '/pages/tabbar/function/subpages/weather/index'
    },

    // 用户相关
    USER: {
      PROFILE: '/pages/tabbar/profile/index',
      INFO: '/pages/user/user'
    }
  },

  // 导航方法封装
  navigateTo(url, params = {}) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
    const fullUrl = queryString ? `${url}?${queryString}` : url

    return new Promise((resolve, reject) => {
      uni.navigateTo({
        url: fullUrl,
        success: resolve,
        fail: reject
      })
    })
  },

  switchTab(url) {
    return new Promise((resolve, reject) => {
      uni.switchTab({
        url,
        success: resolve,
        fail: reject
      })
    })
  },

  redirectTo(url, params = {}) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
    const fullUrl = queryString ? `${url}?${queryString}` : url

    return new Promise((resolve, reject) => {
      uni.redirectTo({
        url: fullUrl,
        success: resolve,
        fail: reject
      })
    })
  },

  navigateBack(delta = 1) {
    return new Promise((resolve, reject) => {
      uni.navigateBack({
        delta,
        success: resolve,
        fail: reject
      })
    })
  },

  reLaunch(url, params = {}) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
    const fullUrl = queryString ? `${url}?${queryString}` : url

    return new Promise((resolve, reject) => {
      uni.reLaunch({
        url: fullUrl,
        success: resolve,
        fail: reject
      })
    })
  }
}

