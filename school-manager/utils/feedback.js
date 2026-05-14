// 提示消息
export function showToast(title, icon = 'none', duration = 2000) {
  uni.showToast({
    title,
    icon,
    duration
  })
}

// 显示加载
export function showLoading(title = '加载中...', mask = true) {
  uni.showLoading({
    title,
    mask
  })
}

// 隐藏加载
export function hideLoading() {
  uni.hideLoading()
}

// 显示模态框
export function showModal(options) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: options.title || '提示',
      content: options.content || '',
      showCancel: options.showCancel !== false,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      success: (res) => {
        if (res.confirm) {
          resolve(true)
        } else if (res.cancel) {
          reject(false)
        }
      },
      fail: reject
    })
  })
}

