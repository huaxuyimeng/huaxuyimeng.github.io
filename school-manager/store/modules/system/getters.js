// store/modules/system/getters.js
export default {
    // 获取系统信息
    systemInfo: (state) => state.systemInfo,

    // 获取配置信息
    config: (state) => state.config,

    // 获取统计数据
    statistics: (state) => state.statistics,

    // 获取加载状态
    loading: (state) => state.loading,

    // 获取平台信息
    platform: (state) => {
        if (state.systemInfo) {
            return state.systemInfo.platform || 'unknown'
        }
        return 'unknown'
    },

    // 获取系统版本
    systemVersion: (state) => {
        if (state.systemInfo) {
            return state.systemInfo.system || 'unknown'
        }
        return 'unknown'
    },

    // 获取屏幕宽度
    screenWidth: (state) => {
        if (state.systemInfo) {
            return state.systemInfo.screenWidth || 0
        }
        return 0
    },

    // 获取屏幕高度
    screenHeight: (state) => {
        if (state.systemInfo) {
            return state.systemInfo.screenHeight || 0
        }
        return 0
    },

    // 获取状态栏高度
    statusBarHeight: (state) => {
        if (state.systemInfo) {
            return state.systemInfo.statusBarHeight || 0
        }
        return 0
    },

    // 获取安全区域信息
    safeArea: (state) => {
        if (state.systemInfo && state.systemInfo.safeArea) {
            return state.systemInfo.safeArea
        }
        return null
    }
}

