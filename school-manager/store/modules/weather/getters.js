// store/modules/weather/getters.js
export default {
  currentWeather: state => state.currentWeather,
  forecast: state => state.forecast,
  city: state => state.city,
  loading: state => state.loading
}

