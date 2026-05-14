// plugins/uni-app/index.js - uni-app插件
export default {
  install(app) {
    // 扩展uni对象
    app.config.globalProperties.$uni = uni
    
    // 添加自定义方法
    uni.$showLoading = (title = '加载中...') => {
      uni.showLoading({ title })
    }
    
    uni.$hideLoading = () => {
      uni.hideLoading()
    }
    
    uni.$showToast = (title, icon = 'none') => {
      uni.showToast({ title, icon })
    }
    
    uni.$showModal = (options) => {
      return new Promise((resolve, reject) => {
        uni.showModal({
          ...options,
          success: (res) => {
            if (res.confirm) {
              resolve(res)
            } else {
              reject(res)
            }
          },
          fail: reject
        })
      })
    }
    
    // 页面跳转封装
    uni.$navigateTo = (url, params = {}) => {
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
    }
    
    uni.$switchTab = (url) => {
      return new Promise((resolve, reject) => {
        uni.switchTab({
          url,
          success: resolve,
          fail: reject
        })
      })
    }
    
    uni.$navigateBack = (delta = 1) => {
      return new Promise((resolve, reject) => {
        uni.navigateBack({
          delta,
          success: resolve,
          fail: reject
        })
      })
    }
  }
}

