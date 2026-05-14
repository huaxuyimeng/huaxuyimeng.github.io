// store/modules/weather/mutations.js
export default {
  SET_CURRENT_WEATHER(state, weather) {
    state.currentWeather = weather
  },
  
  SET_FORECAST(state, forecast) {
    state.forecast = forecast
  },
  
  SET_CITY(state, city) {
    state.city = city
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

