// store/modules/user/actions.js
import * as userApi from '@/api/index.js'

export default {
  // 登录
  async login({ commit }, { username, password }) {
    try {
      const res = await userApi.login({ username, password })
      commit('SET_TOKEN', res.token)
      commit('SET_USER_INFO', res.userInfo)
      commit('SET_PERMISSIONS', res.userInfo.permissions || [])
      commit('SET_ROLES', res.userInfo.roles || [])
      return res
    } catch (error) {
      throw error
    }
  },
  
  // 获取用户信息
  async getUserInfo({ commit }) {
    try {
      const res = await userApi.getUserInfo()
      commit('SET_USER_INFO', res)
      commit('SET_PERMISSIONS', res.permissions || [])
      commit('SET_ROLES', res.roles || [])
      return res
    } catch (error) {
      throw error
    }
  },
  
  // 更新用户信息
  async updateUserInfo({ commit }, userInfo) {
    try {
      const res = await userApi.updateUserInfo(userInfo)
      commit('SET_USER_INFO', res)
      return res
    } catch (error) {
      throw error
    }
  },
  
  // 登出
  async logout({ commit }) {
    try {
      await userApi.logout()
      commit('CLEAR_USER')
      return true
    } catch (error) {
      // 即使API失败也清除本地数据
      commit('CLEAR_USER')
      throw error
    }
  }
}

