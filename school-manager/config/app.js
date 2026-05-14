// config/app.js - 应用配置
import env from './env.js'
import constant from './constant.js'

export default {
  // 应用信息
  name: constant.APP_NAME,
  version: constant.APP_VERSION,
  
  // 环境配置
  env: env,
  
  // 基础URL
  baseURL: env.baseURL,
  uploadURL: env.uploadURL,
  socketURL: env.socketURL,
  
  // 调试模式
  debug: env.debug,
  
  // 平台信息
  platform: process.env.UNI_PLATFORM,
  
  // 应用配置
  config: {
    // 是否启用下拉刷新
    enablePullDownRefresh: true,
    
    // 是否启用上拉加载
    enableReachBottom: true,
    
    // 默认导航栏样式
    navigationBarStyle: 'default',
    
    // 默认导航栏标题
    navigationBarTitleText: constant.APP_NAME,
    
    // 默认背景色
    backgroundColor: '#F5F5F5',
    
    // 默认文字颜色
    navigationBarTextStyle: 'black'
  },
  
  // 获取系统信息
  getSystemInfo() {
    return uni.getSystemInfoSync()
  },
  
  // 获取设备信息
  getDeviceInfo() {
    const systemInfo = this.getSystemInfo()
    return {
      platform: systemInfo.platform,
      system: systemInfo.system,
      version: systemInfo.version,
      model: systemInfo.model,
      brand: systemInfo.brand,
      pixelRatio: systemInfo.pixelRatio,
      screenWidth: systemInfo.screenWidth,
      screenHeight: systemInfo.screenHeight,
      windowWidth: systemInfo.windowWidth,
      windowHeight: systemInfo.windowHeight,
      statusBarHeight: systemInfo.statusBarHeight,
      safeArea: systemInfo.safeArea
    }
  }
}

