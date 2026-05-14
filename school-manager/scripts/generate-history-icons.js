// scripts/generate-history-icons.js
// 历史记录页面图标生成脚本

const fs = require('fs');
const path = require('path');

// 历史记录页面需要的图标配置
const historyIconConfig = {
  // 导航图标
  'back': {
    path: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    size: 24,
    color: '#fff',
    description: '返回按钮'
  },
  'left': {
    path: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    size: 24,
    color: '#fff',
    description: '左箭头'
  },
  
  // 筛选和搜索图标
  'calendar': {
    path: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z',
    size: 24,
    color: '#666',
    description: '日历筛选'
  },
  'filters': {
    path: 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
    size: 24,
    color: '#666',
    description: '筛选器'
  },
  'search': {
    path: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    size: 24,
    color: '#666',
    description: '搜索'
  },
  'close': {
    path: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    size: 24,
    color: '#999',
    description: '关闭'
  },
  'bottom': {
    path: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
    size: 24,
    color: '#999',
    description: '下拉箭头'
  },
  
  // 操作图标
  'download': {
    path: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    size: 24,
    color: '#666',
    description: '导出下载'
  },
  'top': {
    path: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
    size: 24,
    color: '#fff',
    description: '返回顶部'
  },
  'trash': {
    path: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    size: 24,
    color: '#FF3B30',
    description: '删除'
  },
  
  // 状态图标
  'eye': {
    path: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    size: 24,
    color: '#666',
    description: '浏览量'
  },
  'clock': {
    path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    size: 24,
    color: '#999',
    description: '时间'
  },
  'videocam': {
    path: 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z',
    size: 24,
    color: '#fff',
    description: '视频'
  },
  'heart': {
    path: 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z',
    size: 24,
    color: '#999',
    description: '点赞'
  },
  'chat': {
    path: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z',
    size: 24,
    color: '#999',
    description: '评论'
  },
  'star': {
    path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    size: 24,
    color: '#ccc',
    description: '收藏（未选中）'
  },
  'star-filled': {
    path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    size: 24,
    color: '#ff9500',
    description: '收藏（已选中）'
  },
  'checkmarkempty': {
    path: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    size: 24,
    color: '#fff',
    description: '复选框选中'
  },
  
  // 统计图标
  'calendar-stat': {
    path: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z',
    size: 30,
    color: '#007AFF',
    description: '统计日历'
  },
  'eye-stat': {
    path: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    size: 30,
    color: '#34C759',
    description: '统计浏览'
  },
  'clock-stat': {
    path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    size: 30,
    color: '#FF9500',
    description: '统计时长'
  },
  'star-stat': {
    path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    size: 30,
    color: '#FF3B30',
    description: '统计收藏'
  }
};

/**
 * 生成 SVG 图标文件
 * @param {string} iconName - 图标名称
 * @param {object} config - 图标配置
 * @param {string} outputDir - 输出目录
 */
function generateSVGIcon(iconName, config, outputDir) {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${config.size}" height="${config.size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="${config.path}" fill="${config.color}" fill-rule="evenodd" clip-rule="evenodd"/>
</svg>`;
  
  const filePath = path.join(outputDir, `${iconName}.svg`);
  fs.writeFileSync(filePath, svgContent, 'utf-8');
  console.log(`✓ 生成: ${iconName}.svg (${config.description})`);
}

/**
 * 生成所有历史记录图标
 */
function generateAllHistoryIcons() {
  const outputDir = path.join(__dirname, '../static/icons/history');
  
  // 确保目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('开始生成历史记录页面图标...\n');
  
  // 生成所有图标
  Object.keys(historyIconConfig).forEach(iconName => {
    const config = historyIconConfig[iconName];
    generateSVGIcon(iconName, config, outputDir);
  });
  
  // 生成图标映射文件
  const iconMapContent = `// 历史记录页面图标映射
// 自动生成，请勿手动修改

export const historyIcons = {
${Object.keys(historyIconConfig).map(iconName => {
  const config = historyIconConfig[iconName];
  return `  '${iconName}': {
    path: '${config.path}',
    size: ${config.size},
    color: '${config.color}',
    description: '${config.description}'
  }`;
}).join(',\n')}
};

/**
 * 获取图标 SVG 路径
 * @param {string} iconName - 图标名称
 * @returns {string} SVG path
 */
export function getHistoryIconPath(iconName) {
  return historyIcons[iconName]?.path || '';
}

/**
 * 获取图标配置
 * @param {string} iconName - 图标名称
 * @returns {object|null} 图标配置
 */
export function getHistoryIconConfig(iconName) {
  return historyIcons[iconName] || null;
}
`;
  
  const mapFilePath = path.join(outputDir, 'index.js');
  fs.writeFileSync(mapFilePath, iconMapContent, 'utf-8');
  console.log(`\n✓ 生成图标映射文件: index.js`);
  
  console.log('\n历史记录页面图标生成完成！');
  console.log(`输出目录: ${outputDir}`);
  console.log(`\n共生成 ${Object.keys(historyIconConfig).length} 个图标`);
}

/**
 * 检查图标使用情况
 * @param {string} historyFilePath - 历史记录页面文件路径
 */
function checkIconUsage(historyFilePath) {
  if (!fs.existsSync(historyFilePath)) {
    console.log('历史记录页面文件不存在');
    return;
  }
  
  const content = fs.readFileSync(historyFilePath, 'utf-8');
  const usedIcons = [];
  
  // 查找 uni-icons 的使用，支持动态表达式
  const iconMatches = content.matchAll(/uni-icons[^>]*type=["']([^"']+)["']/g);
  for (const match of iconMatches) {
    const iconType = match[1].trim();
    // 跳过包含表达式的动态类型（如三元表达式）
    if (iconType.includes('?') || iconType.includes(':') || iconType.includes('${')) {
      // 尝试提取实际使用的图标
      // 例如: item.isCollected ? 'star-filled' : 'star'
      const starFilledMatch = iconType.match(/star-filled/);
      const starMatch = iconType.match(/star(?!-filled)/);
      if (starFilledMatch) usedIcons.push('star-filled');
      if (starMatch) usedIcons.push('star');
      continue;
    }
    usedIcons.push(iconType);
  }
  
  console.log('\n检查图标使用情况...');
  console.log(`发现 ${usedIcons.length} 个图标使用`);
  
  const uniqueIcons = [...new Set(usedIcons)].sort();
  console.log(`\n使用的图标类型：`);
  let missingCount = 0;
  uniqueIcons.forEach(icon => {
    const config = historyIconConfig[icon];
    if (config) {
      console.log(`  ✓ ${icon} - ${config.description}`);
    } else {
      console.log(`  ⚠ ${icon} - 未在配置中定义`);
      missingCount++;
    }
  });
  
  if (missingCount === 0) {
    console.log(`\n✓ 所有使用的图标都已配置！`);
  } else {
    console.log(`\n⚠ 有 ${missingCount} 个图标未配置，请检查是否需要添加到配置中。`);
  }
}

// 执行生成
if (require.main === module) {
  generateAllHistoryIcons();
  
  // 检查历史记录页面的图标使用
  const historyFilePath = path.join(__dirname, '../pages/user/history.vue');
  checkIconUsage(historyFilePath);
}

module.exports = { 
  generateAllHistoryIcons, 
  historyIconConfig,
  checkIconUsage
};
