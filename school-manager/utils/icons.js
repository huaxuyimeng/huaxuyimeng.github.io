// 图标映射工具文件
// 统一管理所有图标，支持emoji和iconfont两种方式

export const iconMap = {
  // 功能图标
  'icon-schedule': '📅',
  'icon-library': '📚',
  'icon-card': '💳',
  'icon-map': '🗺️',
  'icon-canteen': '🍽️',
  'icon-bus': '🚌',
  'icon-score': '📊',
  'icon-lost': '🔍',
  'icon-leave': '📝',
  'icon-electricity': '⚡',
  'icon-repair': '🔧',
  'icon-classroom': '🏫',
  'icon-exam': '📝',
  'icon-video': '🎥',
  'icon-ebook': '📖',
  'icon-experiment': '🔬',
  'icon-hospital': '🏥',
  'icon-service': '🛎️',
  'icon-psychology': '💭',
  'icon-career': '💼',
  'icon-post': '📮',
  'icon-activity': '🎉',
  'icon-consult': '💬',
  'icon-feedback': '📋',
  'icon-scan': '📷',
  'icon-share': '↗️',
  'icon-calendar': '📅',
  'icon-weather': '🌤️',
  'icon-notice': '📢',
  'icon-wifi': '📶',
  'icon-all': '📦',
  'icon-study': '📚',
  'icon-life': '🏠',
  'icon-campus': '🏛️',
  'icon-tools': '🛠️',
  'icon-entertainment': '🎮',
  'icon-social': '👥',
  
  // 通用图标
  'icon-search': '🔍',
  'icon-location': '📍',
  'icon-notification': '🔔',
  'icon-settings': '⚙️',
  'icon-add': '+',
  'icon-close': '×',
  'icon-back': '←',
  'icon-forward': '→',
  'icon-up': '↑',
  'icon-down': '↓',
  'icon-check': '✓',
  'icon-edit': '✏️',
  'icon-delete': '🗑️',
  'icon-like': '❤️',
  'icon-unlike': '🤍',
  'icon-view': '👁️',
  'icon-share': '↗️',
  'icon-more': '⋯',
  'icon-menu': '☰',
  'icon-user': '👤',
  'icon-time': '⏰',
  'icon-date': '📅',
  'icon-folder': '📁',
  'icon-export': '📤',
  'icon-sync': '🔄',
  'icon-lock': '🔒',
  'icon-unlock': '🔓',
  'icon-play': '▶️',
  'icon-pause': '⏸️',
  'icon-stop': '⏹️'
}

/**
 * 获取图标
 * @param {string} iconName - 图标名称
 * @returns {string} 图标字符或类名
 */
export function getIcon(iconName) {
  if (!iconName) return ''
  
  // 如果已经是emoji，直接返回
  if (/[\u{1F300}-\u{1F9FF}]/u.test(iconName)) {
    return iconName
  }
  
  // 如果是iconfont类名，返回对应的emoji
  return iconMap[iconName] || iconName
}

/**
 * 判断是否是iconfont类名
 * @param {string} iconName - 图标名称
 * @returns {boolean}
 */
export function isIconFont(iconName) {
  return iconName && iconName.startsWith('icon-')
}

/**
 * 获取所有图标列表
 * @returns {Object}
 */
export function getAllIcons() {
  return iconMap
}


