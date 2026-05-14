// utils/device.js - 设备工具函数

/**
 * 获取系统信息
 * @returns {object}
 */
export function getSystemInfo() {
  try {
    return uni.getSystemInfoSync()
  } catch (error) {
    console.error('获取系统信息失败:', error)
    return {}
  }
}

/**
 * 获取设备型号
 * @returns {string}
 */
export function getDeviceModel() {
  const info = getSystemInfo()
  return info.model || ''
}

/**
 * 获取系统版本
 * @returns {string}
 */
export function getSystemVersion() {
  const info = getSystemInfo()
  return info.system || ''
}

/**
 * 获取平台类型
 * @returns {string}
 */
export function getPlatform() {
  const info = getSystemInfo()
  return info.platform || ''
}

/**
 * 判断是否为iOS
 * @returns {boolean}
 */
export function isIOS() {
  const platform = getPlatform()
  return platform.toLowerCase() === 'ios'
}

/**
 * 判断是否为Android
 * @returns {boolean}
 */
export function isAndroid() {
  const platform = getPlatform()
  return platform.toLowerCase() === 'android'
}

/**
 * 获取状态栏高度
 * @returns {number}
 */
export function getStatusBarHeight() {
  const info = getSystemInfo()
  return info.statusBarHeight || 0
}

/**
 * 获取安全区域
 * @returns {object}
 */
export function getSafeArea() {
  const info = getSystemInfo()
  return info.safeArea || {}
}

