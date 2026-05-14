// store/index.js
import { createStore } from 'vuex'
import user from './modules/user'
import activity from './modules/activity'
import news from './modules/news'
import weather from './modules/weather'
import functionModule from './modules/function'
import consult from './modules/consult'
import system from './modules/system'
import aiAssistant from './modules/ai-assistant'  // 导入 ai-assistant 模块

const store = createStore({
  modules: {
    user,
    activity,
    news,
    weather,
    function: functionModule,
    consult,
    system,
    aiAssistant  // 使用导入的模块
  },
  
  // 全局状态
  state: {
    appName: '校园助手',
    version: '1.0.0',
    theme: 'light'
  },
  
  getters: {
    appInfo: state => `${state.appName} v${state.version}`
  },
  
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme
    }
  },
  
  actions: {
    switchTheme({ commit }, theme) {
      commit('SET_THEME', theme)
    }
  }
})

export default store