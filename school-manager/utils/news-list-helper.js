// 新闻列表页辅助工具函数
// 用于替代 Pinia stores 的简单实现

// 模拟新闻 store
export const useNewsHelper = () => {
  const getNewsList = async (params) => {
    // 这里应该调用真实的 API
    return Promise.resolve([])
  }

  const getTodayNews = async () => {
    return Promise.resolve([])
  }

  const getHotNews = async () => {
    return Promise.resolve([])
  }

  return {
    getNewsList,
    getTodayNews,
    getHotNews
  }
}

// 模拟用户 store
export const useUserHelper = () => {
  const isLoggedIn = () => {
    const token = uni.getStorageSync('token')
    return !!token
  }

  const checkLogin = () => {
    if (!isLoggedIn()) {
      uni.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/user/login'
            })
          }
        }
      })
      return false
    }
    return true
  }

  return {
    isLoggedIn,
    checkLogin
  }
}

// 模拟设置 store
export const useSettingHelper = () => {
  const getSettings = () => {
    return uni.getStorageSync('appSettings') || {
      viewMode: 'list',
      nightMode: false
    }
  }

  const saveSettings = (settings) => {
    uni.setStorageSync('appSettings', settings)
  }

  return {
    getSettings,
    saveSettings
  }
}
