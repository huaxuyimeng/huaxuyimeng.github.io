// utils/string.js - 字符串工具函数

/**
 * 截断字符串
 * @param {string} str - 字符串
 * @param {number} length - 最大长度
 * @param {string} suffix - 后缀，默认 '...'
 * @returns {string}
 */
export function truncate(str, length, suffix = '...') {
  if (!str) return ''
  if (str.length <= length) return str
  return str.substring(0, length) + suffix
}

/**
 * 首字母大写
 * @param {string} str - 字符串
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * 驼峰命名转下划线命名
 * @param {string} str - 字符串
 * @returns {string}
 */
export function camelToSnake(str) {
  if (!str) return ''
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 下划线命名转驼峰命名
 * @param {string} str - 字符串
 * @returns {string}
 */
export function snakeToCamel(str) {
  if (!str) return ''
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 去除HTML标签
 * @param {string} html - HTML字符串
 * @returns {string}
 */
export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
}

/**
 * 转义HTML
 * @param {string} str - 字符串
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return str.replace(/[&<>"']/g, m => map[m])
}

/**
 * 反转义HTML
 * @param {string} str - 字符串
 * @returns {string}
 */
export function unescapeHtml(str) {
  if (!str) return ''
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  }
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m])
}

