// mock/index.js - Mock数据主文件
import server from './server.js'
import * as activityMock from './modules/activity.js'
import * as userMock from './modules/user.js'
import * as newsMock from './modules/news.js'
import * as weatherMock from './modules/weather.js'
import * as functionMock from './modules/function.js'
import * as consultMock from './modules/consult.js'

// 是否启用Mock
const ENABLE_MOCK = process.env.NODE_ENV === 'development'

export default {
  // 启动Mock服务器
  start() {
    if (!ENABLE_MOCK) {
      console.log('Mock server is disabled in production')
      return
    }
    
    server.start()
    console.log('Mock server started')
  },
  
  // 停止Mock服务器
  stop() {
    if (!ENABLE_MOCK) return
    server.stop()
    console.log('Mock server stopped')
  },
  
  // 获取Mock数据
  getMockData(module, method) {
    const moduleData = {
      activity: activityMock,
      user: userMock,
      news: newsMock,
      weather: weatherMock,
      function: functionMock,
      consult: consultMock
    }
    
    const data = moduleData[module]
    if (!data) return null
    
    return data[method] ? data[method]() : null
  }
}

// 导出Mock数据
export {
  activityMock,
  userMock,
  newsMock,
  weatherMock,
  functionMock,
  consultMock
}

