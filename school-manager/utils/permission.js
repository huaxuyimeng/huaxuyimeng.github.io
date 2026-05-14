// utils/permission.js - 权限工具函数

/**
 * 请求权限
 * @param {string} scope - 权限范围
 * @returns {Promise<boolean>}
 */
export function requestPermission(scope) {
  return new Promise((resolve, reject) => {
    uni.authorize({
      scope,
      success: () => {
        resolve(true)
      },
      fail: (err) => {
        console.error('授权失败:', err)
        // 引导用户去设置页面
        uni.showModal({
          title: '需要授权',
          content: '请在设置中开启相应权限',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success: (settingRes) => {
                  if (settingRes.authSetting[scope]) {
                    resolve(true)
                  } else {
                    resolve(false)
                  }
                }
              })
            } else {
              resolve(false)
            }
          }
        })
      }
    })
  })
}

/**
 * 检查权限状态
 * @param {string} scope - 权限范围
 * @returns {Promise<boolean>}
 */
export function checkPermission(scope) {
  return new Promise((resolve) => {
    uni.getSetting({
      success: (res) => {
        resolve(res.authSetting[scope] === true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

