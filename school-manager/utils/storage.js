// utils/storage.js - 本地存储工具函数

/**
 * 设置存储
 * @param {string} key - 键
 * @param {any} value - 值
 * @param {boolean} sync - 是否同步，默认false
 */
export function setStorage(key, value, sync = false) {
  try {
    const data = JSON.stringify(value)
    if (sync) {
      uni.setStorageSync(key, data)
    } else {
      uni.setStorage({
        key,
        data
      })
    }
  } catch (error) {
    console.error('存储失败:', error)
  }
}

/**
 * 获取存储
 * @param {string} key - 键
 * @param {any} defaultValue - 默认值
 * @param {boolean} sync - 是否同步，默认false
 * @returns {any}
 */
export function getStorage(key, defaultValue = null, sync = false) {
  try {
    let data
    if (sync) {
      data = uni.getStorageSync(key)
    } else {
      data = uni.getStorageSync(key) // 异步方式在uni-app中也需要用同步方法
    }
    
    if (data === null || data === undefined || data === '') {
      return defaultValue
    }
    
    return JSON.parse(data)
  } catch (error) {
    console.error('获取存储失败:', error)
    return defaultValue
  }
}

/**
 * 删除存储
 * @param {string} key - 键
 * @param {boolean} sync - 是否同步，默认false
 */
export function removeStorage(key, sync = false) {
  try {
    if (sync) {
      uni.removeStorageSync(key)
    } else {
      uni.removeStorage({ key })
    }
  } catch (error) {
    console.error('删除存储失败:', error)
  }
}

/**
 * 清空存储
 * @param {boolean} sync - 是否同步，默认false
 */
export function clearStorage(sync = false) {
  try {
    if (sync) {
      uni.clearStorageSync()
    } else {
      uni.clearStorage()
    }
  } catch (error) {
    console.error('清空存储失败:', error)
  }
}

/**
 * 获取所有存储的键
 * @returns {string[]}
 */
export function getAllStorageKeys() {
  try {
    const info = uni.getStorageInfoSync()
    return info.keys || []
  } catch (error) {
    console.error('获取存储键失败:', error)
    return []
  }
}

// 默认导出，提供类似 class14 的 API
const storage = {
  get(key, defaultValue = null) {
    return getStorage(key, defaultValue, true)
  },
  set(key, value) {
    return setStorage(key, value, true)
  },
  remove(key) {
    return removeStorage(key, true)
  },
  clear() {
    return clearStorage(true)
  }
}

export default storage
