// store/modules/system/mutations.js
export default {
  SET_SYSTEM_INFO(state, info) {
    state.systemInfo = info
  },
  
  SET_CONFIG(state, config) {
    state.config = config
  },
  
  SET_STATISTICS(state, statistics) {
    state.statistics = statistics
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

