// store/modules/consult/actions.js
import { consultApi } from '@/api/index.js'

export default {
  async getMessageHistory({ commit }, sessionId) {
    commit('SET_LOADING', true)
    try {
      const res = await consultApi.getMessageHistory({ sessionId })
      commit('SET_MESSAGES', res.messages || [])
      return res
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async sendMessage({ commit }, data) {
    try {
      const res = await consultApi.sendMessage(data)
      commit('ADD_MESSAGE', res)
      return res
    } catch (error) {
      throw error
    }
  }
}

