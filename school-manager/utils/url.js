// utils/url.js - URL工具函数

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @param {string} url - URL，默认当前页面URL
 * @returns {string|null}
 */
export function getUrlParam(name, url = '') {
  const search = url ? new URL(url).search : window.location.search
  const params = new URLSearchParams(search)
  return params.get(name)
}

/**
 * 获取所有URL参数
 * @param {string} url - URL，默认当前页面URL
 * @returns {object}
 */
export function getAllUrlParams(url = '') {
  const search = url ? new URL(url).search : window.location.search
  const params = new URLSearchParams(search)
  const result = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result
}

/**
 * 构建URL查询字符串
 * @param {object} params - 参数对象
 * @returns {string}
 */
export function buildQueryString(params) {
  if (!params || typeof params !== 'object') return ''
  const searchParams = new URLSearchParams()
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      searchParams.append(key, params[key])
    }
  })
  return searchParams.toString()
}

