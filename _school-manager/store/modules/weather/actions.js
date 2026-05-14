// store/modules/weather/actions.js
import { weatherApi } from '@/api/index.js'

export default {
  async getWeather({ commit }, params) {
    commit('SET_LOADING', true)
    try {
      const res = await weatherApi.getWeather(params)
      commit('SET_CURRENT_WEATHER', res)
      return res
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async getForecast({ commit }, params) {
    try {
      const res = await weatherApi.getForecast(params)
      commit('SET_FORECAST', res)
      return res
    } catch (error) {
      throw error
    }
  }
}

