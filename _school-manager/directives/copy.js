// directives/copy.js - 复制指令
export default {
  mounted(el, binding) {
    const { value } = binding
    
    el.addEventListener('click', () => {
      const text = typeof value === 'string' ? value : value?.text || el.textContent
      
      // #ifdef H5
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          uni.showToast({
            title: '复制成功',
            icon: 'success'
          })
        }).catch(() => {
          fallbackCopy(text)
        })
      } else {
        fallbackCopy(text)
      }
      // #endif
      
      // #ifndef H5
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success'
          })
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
      // #endif
    })
  }
}

// H5 fallback 复制方法
function fallbackCopy(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  
  try {
    document.execCommand('copy')
    uni.showToast({
      title: '复制成功',
      icon: 'success'
    })
  } catch (err) {
    uni.showToast({
      title: '复制失败',
      icon: 'none'
    })
  }
  
  document.body.removeChild(textarea)
}

