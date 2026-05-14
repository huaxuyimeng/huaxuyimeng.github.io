// store/modules/activity/actions.js
import { activity } from '@/api/index.js'

export default {
  async getActivityList({ commit }, params) {
    commit('SET_LOADING', true)
    try {
      const res = await activity.getActivityList(params)
      commit('SET_ACTIVITY_LIST', res.list || [])
      return res
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async getActivityDetail({ commit }, id) {
    try {
      const res = await activity.getActivityDetail({ id })
      commit('SET_CURRENT_ACTIVITY', res)
      return res
    } catch (error) {
      throw error
    }
  },
  
  async createActivity({ commit }, data) {
    try {
      const res = await activity.createActivity(data)
      commit('ADD_ACTIVITY', res)
      return res
    } catch (error) {
      throw error
    }
  }
}
