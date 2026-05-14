// directives/debounce.js - 防抖指令
export default {
  mounted(el, binding) {
    const { value } = binding
    const delay = value?.delay || 300
    const immediate = value?.immediate || false
    
    let timer = null
    
    const handler = () => {
      if (timer) {
        clearTimeout(timer)
      }
      
      if (immediate && !timer) {
        value?.handler?.()
      }
      
      timer = setTimeout(() => {
        if (!immediate) {
          value?.handler?.()
        }
        timer = null
      }, delay)
    }
    
    el.addEventListener('click', handler)
    el._debounceHandler = handler
  },
  
  unmounted(el) {
    if (el._debounceHandler) {
      el.removeEventListener('click', el._debounceHandler)
      delete el._debounceHandler
    }
  }
}

