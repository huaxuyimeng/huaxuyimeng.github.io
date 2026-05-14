// store/modules/system/actions.js
import { systemApi } from '@/api/index.js'

export default {
    async getSystemInfo({ commit }) {
        try {
            const res = await systemApi.getSystemInfo()
            commit('SET_SYSTEM_INFO', res)
            return res
        } catch (error) {
            throw error
        }
    },

    async getStatistics({ commit }) {
        commit('SET_LOADING', true)
        try {
            const res = await systemApi.getStatistics()
            commit('SET_STATISTICS', res)
            return res
        } finally {
            commit('SET_LOADING', false)
        }
    }
}

