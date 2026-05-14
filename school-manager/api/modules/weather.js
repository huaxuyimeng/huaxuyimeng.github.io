// api/modules/weather.js
export const weatherApi = {
  // 获取天气
  getWeather: {
    url: '/api/weather/current',
    method: 'GET',
    desc: '获取当前天气'
  },

  // 天气预报
  getForecast: {
    url: '/api/weather/forecast',
    method: 'GET',
    desc: '天气预报'
  },

  // 小时预报
  getHourlyForecast: {
    url: '/api/weather/hourly',
    method: 'GET',
    desc: '小时天气预报'
  },

  // 生活指数
  getLifeIndex: {
    url: '/api/weather/life',
    method: 'GET',
    desc: '生活指数'
  },

  // 空气质量
  getAirQuality: {
    url: '/api/weather/air',
    method: 'GET',
    desc: '空气质量'
  },

  // 天气预警
  getAlerts: {
    url: '/api/weather/alerts',
    method: 'GET',
    desc: '天气预警'
  },

  // 城市搜索
  searchCity: {
    url: '/api/weather/city/search',
    method: 'GET',
    desc: '搜索城市'
  },

  // 设置默认城市
  setDefaultCity: {
    url: '/api/weather/city/default',
    method: 'POST',
    desc: '设置默认城市'
  },

  // 获取默认城市
  getDefaultCity: {
    url: '/api/weather/city/default',
    method: 'GET',
    desc: '获取默认城市'
  }
}

// 默认导出
export default weatherApi
