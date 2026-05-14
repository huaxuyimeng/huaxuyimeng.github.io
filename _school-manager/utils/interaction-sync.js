// utils/interaction-sync.js - 互动数据同步工具
// 用于同步点赞、收藏、评论等数据，并持久化存储

import storage from './storage.js'

// 系统头像列表
export const SYSTEM_AVATARS = [
  '/static/images/生成动物写实头像.png',
  '/static/images/生成动物写实头像 (1).png',
  '/static/images/生成动物写实头像 (2).png',
  '/static/images/生成动物写实头像 (3).png',
  '/static/images/生成动物写实头像 (4).png',
  '/static/images/生成动物写实头像 (5).png',
  '/static/images/生成动物写实头像 (6).png',
  '/static/images/生成动物写实头像 (7).png',
  '/static/images/生成动物写实头像 (8).png',
  '/static/images/生成动物写实头像 (9).png'
]

/**
 * 获取随机系统头像
 */
export function getRandomAvatar() {
  const index = Math.floor(Math.random() * SYSTEM_AVATARS.length)
  return SYSTEM_AVATARS[index]
}

/**
 * 根据用户ID获取固定头像（确保同一用户头像一致）
 */
export function getAvatarByUserId(userId) {
  const index = parseInt(userId.replace(/\D/g, '')) || 0
  return SYSTEM_AVATARS[index % SYSTEM_AVATARS.length]
}

// ========== 点赞数据管理 ==========

/**
 * 获取新闻点赞状态
 */
export function getNewsLikeStatus(newsId) {
  const likedNews = storage.get('likedNews', [])
  return likedNews.includes(newsId)
}

/**
 * 设置新闻点赞状态
 */
export function setNewsLikeStatus(newsId, liked) {
  let likedNews = storage.get('likedNews', [])
  if (liked) {
    if (!likedNews.includes(newsId)) {
      likedNews.push(newsId)
    }
  } else {
    likedNews = likedNews.filter(id => id !== newsId)
  }
  storage.set('likedNews', likedNews)
  return liked
}

/**
 * 获取评论点赞状态
 */
export function getCommentLikeStatus(commentId) {
  const likedComments = storage.get('likedComments', [])
  return likedComments.includes(commentId)
}

/**
 * 设置评论点赞状态
 */
export function setCommentLikeStatus(commentId, liked) {
  let likedComments = storage.get('likedComments', [])
  if (liked) {
    if (!likedComments.includes(commentId)) {
      likedComments.push(commentId)
    }
  } else {
    likedComments = likedComments.filter(id => id !== commentId)
  }
  storage.set('likedComments', likedComments)
  return liked
}

// ========== 收藏数据管理 ==========

/**
 * 获取新闻收藏状态
 */
export function getNewsCollectStatus(newsId) {
  const collectedNews = storage.get('collectedNews', [])
  return collectedNews.includes(newsId)
}

/**
 * 设置新闻收藏状态
 */
export function setNewsCollectStatus(newsId, collected) {
  let collectedNews = storage.get('collectedNews', [])
  if (collected) {
    if (!collectedNews.includes(newsId)) {
      collectedNews.push(newsId)
    }
  } else {
    collectedNews = collectedNews.filter(id => id !== newsId)
  }
  storage.set('collectedNews', collectedNews)
  return collected
}

/**
 * 添加收藏到收藏列表
 */
export function addToCollections(newsDetail) {
  if (!newsDetail || !newsDetail.id) return
  
  let collections = storage.get('myCollections', [])
  const exists = collections.find(item => item.id === newsDetail.id)
  
  if (!exists) {
    collections.unshift({
      id: newsDetail.id,
      title: newsDetail.title,
      coverImage: newsDetail.cover,
      cover: newsDetail.cover,
      category: newsDetail.category,
      tag: newsDetail.tag,
      viewCount: newsDetail.viewCount || 0,
      likeCount: newsDetail.likeCount || 0,
      commentCount: newsDetail.commentCount || 0,
      collectTime: Date.now(),
      description: newsDetail.description || newsDetail.excerpt || '',
      isFavorited: false
    })
    storage.set('myCollections', collections)
  }
}

/**
 * 从收藏列表移除
 */
export function removeFromCollections(newsId) {
  let collections = storage.get('myCollections', [])
  collections = collections.filter(item => item.id !== newsId)
  storage.set('myCollections', collections)
}

// ========== 评论数据管理 ==========

/**
 * 获取新闻的评论列表
 */
export function getNewsComments(newsId) {
  const allComments = storage.get('newsComments', {})
  return allComments[newsId] || []
}

/**
 * 保存新闻的评论列表
 */
export function saveNewsComments(newsId, comments) {
  const allComments = storage.get('newsComments', {})
  allComments[newsId] = comments
  storage.set('newsComments', allComments)
}

/**
 * 添加评论
 */
export function addComment(newsId, comment) {
  const comments = getNewsComments(newsId)
  comments.unshift(comment)
  saveNewsComments(newsId, comments)
  
  // 同时保存到我的评论列表
  const myComments = storage.get('myComments', [])
  myComments.unshift({
    ...comment,
    newsId: newsId,
    newsTitle: comment.newsTitle || '',
    sourceId: newsId
  })
  storage.set('myComments', myComments)
  
  return comment
}

/**
 * 更新评论点赞状态
 */
export function updateCommentLike(commentId, liked, newsId) {
  const comments = getNewsComments(newsId)
  const comment = comments.find(c => c.id === commentId)
  if (comment) {
    comment.liked = liked
    comment.likeCount = (comment.likeCount || 0) + (liked ? 1 : -1)
    saveNewsComments(newsId, comments)
    
    // 同步更新我的评论列表
    const myComments = storage.get('myComments', [])
    const myComment = myComments.find(c => c.id === commentId)
    if (myComment) {
      myComment.liked = liked
      myComment.likeCount = comment.likeCount
      storage.set('myComments', myComments)
    }
  }
}

// ========== 新闻数据管理 ==========

/**
 * 更新新闻的点赞数
 */
export function updateNewsLikeCount(newsId, increment) {
  const newsData = storage.get('newsData', {})
  if (!newsData[newsId]) {
    newsData[newsId] = { likeCount: 0 }
  }
  newsData[newsId].likeCount = (newsData[newsId].likeCount || 0) + increment
  storage.set('newsData', newsData)
  return newsData[newsId].likeCount
}

/**
 * 更新新闻的评论数
 */
export function updateNewsCommentCount(newsId, increment) {
  const newsData = storage.get('newsData', {})
  if (!newsData[newsId]) {
    newsData[newsId] = { commentCount: 0 }
  }
  newsData[newsId].commentCount = (newsData[newsId].commentCount || 0) + increment
  storage.set('newsData', newsData)
  return newsData[newsId].commentCount
}

/**
 * 获取新闻的点赞数
 */
export function getNewsLikeCount(newsId) {
  const newsData = storage.get('newsData', {})
  return newsData[newsId]?.likeCount || 0
}

/**
 * 获取新闻的评论数
 */
export function getNewsCommentCount(newsId) {
  const newsData = storage.get('newsData', {})
  return newsData[newsId]?.commentCount || 0
}

// ========== 浏览历史管理 ==========

/**
 * 添加到浏览历史
 */
export function addToHistory(newsDetail) {
  if (!newsDetail || !newsDetail.id) return
  
  let history = storage.get('browsingHistory', [])
  // 移除已存在的记录
  history = history.filter(item => item.id !== newsDetail.id)
  // 添加到开头
  history.unshift({
    id: newsDetail.id,
    title: newsDetail.title,
    cover: newsDetail.cover,
    coverImage: newsDetail.cover,
    category: newsDetail.category,
    tag: newsDetail.tag,
    viewTime: Date.now(),
    viewCount: 1,
    viewDuration: 0,
    isCollected: getNewsCollectStatus(newsDetail.id)
  })
  // 最多保存100条
  storage.set('browsingHistory', history.slice(0, 100))
}

export default {
  // 头像
  getRandomAvatar,
  getAvatarByUserId,
  SYSTEM_AVATARS,
  
  // 点赞
  getNewsLikeStatus,
  setNewsLikeStatus,
  getCommentLikeStatus,
  setCommentLikeStatus,
  
  // 收藏
  getNewsCollectStatus,
  setNewsCollectStatus,
  addToCollections,
  removeFromCollections,
  
  // 评论
  getNewsComments,
  saveNewsComments,
  addComment,
  updateCommentLike,
  
  // 新闻数据
  updateNewsLikeCount,
  updateNewsCommentCount,
  getNewsLikeCount,
  getNewsCommentCount,
  
  // 浏览历史
  addToHistory
}
