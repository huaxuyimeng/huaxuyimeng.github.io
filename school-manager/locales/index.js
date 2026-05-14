// locales/index.js - 国际化主文件
import zhCN from './zh-CN.js'
import enUS from './en-US.js'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

// 获取当前语言
export function getCurrentLanguage() {
  return uni.getStorageSync('language') || 'zh-CN'
}

// 设置语言
export function setLanguage(lang) {
  uni.setStorageSync('language', lang)
  uni.$emit('language-change', lang)
}

// 获取翻译文本
export function t(key, params = {}) {
  const lang = getCurrentLanguage()
  const messages = getMessages(lang)
  
  // 支持嵌套key，如 'user.name'
  const keys = key.split('.')
  let value = messages
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      return key
    }
  }
  
  if (typeof value !== 'string') {
    return key
  }
  
  // 替换参数
  return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
    return params[paramKey] !== undefined ? params[paramKey] : match
  })
}

// 获取指定语言的消息
export function getMessages(lang) {
  return messages[lang] || messages['zh-CN']
}

// 导出所有语言包
export { zhCN, enUS }

export default {
  getCurrentLanguage,
  setLanguage,
  t,
  getMessages
}

