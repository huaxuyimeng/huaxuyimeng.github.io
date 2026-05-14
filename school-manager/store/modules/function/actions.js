// store/modules/function/actions.js
import { functionApi } from '@/api/index.js'

export default {
  async getFunctionList({ commit }) {
    commit('SET_LOADING', true)
    try {
      const res = await functionApi.getFunctionList()
      commit('SET_FUNCTION_LIST', res)
      return res
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

