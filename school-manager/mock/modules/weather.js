// mock/modules/weather.js - 天气Mock数据
export function getWeather() {
  return {
    city: '北京',
    temperature: 15,
    condition: '晴',
    humidity: 45,
    windSpeed: 10,
    windDirection: '东北风',
    aqi: 85,
    aqiLevel: '良',
    updateTime: new Date().toISOString()
  }
}

export function getForecast() {
  return {
    city: '北京',
    current: getWeather(),
    daily: [
      { date: '2024-12-16', high: 18, low: 8, condition: '晴' },
      { date: '2024-12-17', high: 16, low: 6, condition: '多云' },
      { date: '2024-12-18', high: 14, low: 4, condition: '小雨' }
    ]
  }
}

