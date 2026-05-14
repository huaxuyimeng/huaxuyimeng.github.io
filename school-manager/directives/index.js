// directives/index.js - 指令统一导出
import debounce from './debounce.js'
import copy from './copy.js'
import lazyLoad from './lazy-load.js'
import auth from './auth.js'

export default {
  debounce,
  copy,
  lazyLoad,
  auth
}

// 注册所有指令
export function installDirectives(app) {
  app.directive('debounce', debounce)
  app.directive('copy', copy)
  app.directive('lazy-load', lazyLoad)
  app.directive('auth', auth)
}

