// utils/image.js - 图片工具函数

/**
 * 压缩图片
 * @param {string} filePath - 图片路径
 * @param {object} options - 选项
 * @returns {Promise<string>}
 */
export function compressImage(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    uni.compressImage({
      src: filePath,
      quality: options.quality || 80,
      compressedWidth: options.width || 800,
      compressedHeight: options.height || 800,
      success: (res) => {
        resolve(res.tempFilePath)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 选择图片
 * @param {object} options - 选项
 * @returns {Promise<object>}
 */
export function chooseImage(options = {}) {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: options.count || 1,
      sizeType: options.sizeType || ['compressed'],
      sourceType: options.sourceType || ['album', 'camera'],
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 预览图片
 * @param {string|number} current - 当前图片索引或URL
 * @param {string[]} urls - 图片URL数组
 */
export function previewImage(current, urls) {
  uni.previewImage({
    current: typeof current === 'number' ? urls[current] : current,
    urls: urls || [current]
  })
}

