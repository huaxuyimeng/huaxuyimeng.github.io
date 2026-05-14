// filters/index.js - 过滤器统一导出
import * as stringFilters from './string.js'
import * as numberFilters from './number.js'
import * as dateFilters from './date.js'

export default {
  ...stringFilters,
  ...numberFilters,
  ...dateFilters
}

// 注册所有过滤器
export function installFilters(app) {
  Object.keys(stringFilters).forEach(key => {
    app.config.globalProperties[`$${key}`] = stringFilters[key]
  })
  
  Object.keys(numberFilters).forEach(key => {
    app.config.globalProperties[`$${key}`] = numberFilters[key]
  })
  
  Object.keys(dateFilters).forEach(key => {
    app.config.globalProperties[`$${key}`] = dateFilters[key]
  })
}

