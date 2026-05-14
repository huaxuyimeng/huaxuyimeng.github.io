// utils/number.js - 数字工具函数

/**
 * 格式化数字（添加千分位）
 * @param {number} num - 数字
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {number} decimals - 小数位数，默认2
 * @returns {string}
 */
export function formatAmount(amount, decimals = 2) {
  if (amount === null || amount === undefined) return '0.00'
  return Number(amount).toFixed(decimals)
}

/**
 * 格式化百分比
 * @param {number} num - 数字
 * @param {number} decimals - 小数位数，默认2
 * @returns {string}
 */
export function formatPercent(num, decimals = 2) {
  if (num === null || num === undefined) return '0%'
  return `${Number(num).toFixed(decimals)}%`
}

/**
 * 限制数字范围
 * @param {number} num - 数字
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number}
 */
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

