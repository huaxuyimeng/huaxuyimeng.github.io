// config/theme.js - 主题配置
export default {
  // 主题列表
  themes: {
    light: {
      name: '浅色模式',
      primary: '#007AFF',
      background: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666',
      border: '#E5E5E5',
      card: '#FFFFFF',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    dark: {
      name: '深色模式',
      primary: '#0A84FF',
      background: '#000000',
      text: '#FFFFFF',
      textSecondary: '#A3A3A3',
      border: '#404040',
      card: '#1C1C1E',
      shadow: 'rgba(0, 0, 0, 0.5)'
    },
    auto: {
      name: '跟随系统',
      // 自动模式会根据系统设置切换
    }
  },
  
  // 获取当前主题
  getCurrentTheme() {
    const savedTheme = uni.getStorageSync('theme') || 'light'
    if (savedTheme === 'auto') {
      // 获取系统主题
      const systemInfo = uni.getSystemInfoSync()
      return systemInfo.theme === 'dark' ? 'dark' : 'light'
    }
    return savedTheme
  },
  
  // 设置主题
  setTheme(theme) {
    uni.setStorageSync('theme', theme)
    // 触发主题变更事件
    uni.$emit('theme-change', theme)
  }
}

