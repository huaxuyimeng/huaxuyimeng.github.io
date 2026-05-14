// directives/lazy-load.js - 懒加载指令
export default {
  mounted(el, binding) {
    const { value } = binding
    const placeholder = value?.placeholder || '/static/images/placeholder.png'
    
    // 设置占位图
    if (el.tagName === 'IMG') {
      el.src = placeholder
    } else {
      el.style.backgroundImage = `url(${placeholder})`
    }
    
    // 创建 IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageUrl = value?.src || value || el.dataset.src
            
            if (imageUrl) {
              if (el.tagName === 'IMG') {
                el.src = imageUrl
              } else {
                el.style.backgroundImage = `url(${imageUrl})`
              }
              
              // 图片加载完成后移除观察
              if (el.tagName === 'IMG') {
                el.onload = () => {
                  observer.unobserve(el)
                }
                el.onerror = () => {
                  observer.unobserve(el)
                }
              } else {
                observer.unobserve(el)
              }
            }
          }
        })
      },
      {
        rootMargin: '50px' // 提前50px开始加载
      }
    )
    
    observer.observe(el)
    el._lazyLoadObserver = observer
  },
  
  unmounted(el) {
    if (el._lazyLoadObserver) {
      el._lazyLoadObserver.disconnect()
      delete el._lazyLoadObserver
    }
  }
}

