// 新闻详情页辅助工具函数
// 用于替代 Pinia stores 的简单实现

// 模拟新闻 store
export const useNewsHelper = () => {
  const getNewsDetail = async (id) => {
    // 这里应该调用真实的 API
    // 暂时返回模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          title: '新闻标题',
          content: '<p>新闻内容</p>',
          cover: '/static/images/news1.jpg',
          author: '作者',
          publishTime: new Date().toISOString(),
          viewCount: 0,
          likeCount: 0,
          commentCount: 0
        })
      }, 500)
    })
  }

  const toggleNewsLike = async (id) => {
    const likedNews = uni.getStorageSync('likedNews') || []
    const index = likedNews.indexOf(id)
    if (index > -1) {
      likedNews.splice(index, 1)
    } else {
      likedNews.push(id)
    }
    uni.setStorageSync('likedNews', likedNews)
    return Promise.resolve()
  }

  const toggleNewsCollect = async (id, newsDetail = null) => {
    const collectedNews = uni.getStorageSync('collectedNews') || []
    const index = collectedNews.indexOf(id)
    
    if (index > -1) {
      // 取消收藏
      collectedNews.splice(index, 1)
      // 从收藏详情中删除
      let collections = uni.getStorageSync('myCollections') || []
      collections = collections.filter(item => item.id !== id)
      uni.setStorageSync('myCollections', collections)
    } else {
      // 添加收藏
      collectedNews.push(id)
      // 保存收藏详情
      if (newsDetail) {
        let collections = uni.getStorageSync('myCollections') || []
        // 去重
        collections = collections.filter(item => item.id !== id)
        // 添加到开头
        collections.unshift({
          ...newsDetail,
          collectTime: new Date().getTime()
        })
        // 最多保存100条
        if (collections.length > 100) {
          collections.pop()
        }
        uni.setStorageSync('myCollections', collections)
      }
    }
    uni.setStorageSync('collectedNews', collectedNews)
    return Promise.resolve()
  }

  const isNewsLiked = (id) => {
    const likedNews = uni.getStorageSync('likedNews') || []
    return likedNews.includes(id)
  }

  const isNewsCollected = (id) => {
    const collectedNews = uni.getStorageSync('collectedNews') || []
    return collectedNews.includes(id)
  }

  const incrementViewCount = (id) => {
    // 增加浏览量
    const viewHistory = uni.getStorageSync('viewHistory') || {}
    viewHistory[id] = (viewHistory[id] || 0) + 1
    uni.setStorageSync('viewHistory', viewHistory)
  }

  const addToHistory = (news) => {
    const history = uni.getStorageSync('browsingHistory') || []
    const index = history.findIndex(item => item.id === news.id)
    if (index > -1) {
      history.splice(index, 1)
    }
    // 添加浏览时间
    history.unshift({
      ...news,
      viewTime: new Date().getTime()
    })
    // 最多保存50条
    if (history.length > 50) {
      history.pop()
    }
    uni.setStorageSync('browsingHistory', history)
  }

  const getRelatedNews = async (id) => {
    return Promise.resolve([])
  }

  // 报名相关方法
  const joinNewsActivity = async (newsId, formData, newsDetail = null) => {
    // 这里应该调用真实的 API
    // import { news } from '@/api'
    // return await news.joinNewsActivity({ newsId, ...formData })
    
    // 暂时使用本地存储模拟
    const joinedNews = uni.getStorageSync('joinedNews') || []
    const joinRecord = {
      newsId,
      ...formData,
      joinTime: new Date().toISOString(),
      status: 'joined'
    }
    joinedNews.push(joinRecord)
    uni.setStorageSync('joinedNews', joinedNews)
    
    // 保存到我的报名记录
    if (newsDetail) {
      let registrations = uni.getStorageSync('myRegistrations') || []
      // 去重
      registrations = registrations.filter(item => 
        (item.activityId && item.activityId !== newsId) &&
        (item.newsId && item.newsId !== newsId)
      )
      // 添加到开头
      registrations.unshift({
        activityId: newsId,
        newsId: newsId,
        activityTitle: newsDetail.title || newsDetail.activityTitle,
        title: newsDetail.title || newsDetail.activityTitle,
        activityTime: newsDetail.startTime || newsDetail.time || newsDetail.publishTime,
        activityLocation: newsDetail.location,
        location: newsDetail.location,
        ...formData,
        registerTime: new Date().getTime(),
        joinTime: new Date().getTime()
      })
      // 最多保存100条
      if (registrations.length > 100) {
        registrations.pop()
      }
      uni.setStorageSync('myRegistrations', registrations)
    }
    
    return Promise.resolve(joinRecord)
  }

  const cancelJoinNewsActivity = async (newsId) => {
    // 这里应该调用真实的 API
    // import { news } from '@/api'
    // return await news.cancelJoinNewsActivity({ newsId })
    
    // 暂时使用本地存储模拟
    const joinedNews = uni.getStorageSync('joinedNews') || []
    const index = joinedNews.findIndex(item => item.newsId === newsId)
    if (index > -1) {
      joinedNews.splice(index, 1)
      uni.setStorageSync('joinedNews', joinedNews)
    }
    return Promise.resolve()
  }

  const getJoinStatus = async (newsId) => {
    // 这里应该调用真实的 API
    // import { news } from '@/api'
    // return await news.getJoinStatus({ newsId })
    
    // 暂时使用本地存储模拟
    const joinedNews = uni.getStorageSync('joinedNews') || []
    const record = joinedNews.find(item => item.newsId === newsId)
    return Promise.resolve(record ? { joined: true, ...record } : { joined: false })
  }

  const isNewsJoined = (newsId) => {
    const joinedNews = uni.getStorageSync('joinedNews') || []
    return joinedNews.some(item => item.newsId === newsId)
  }

  return {
    getNewsDetail,
    toggleNewsLike,
    toggleNewsCollect,
    isNewsLiked,
    isNewsCollected,
    incrementViewCount,
    addToHistory,
    getRelatedNews,
    joinNewsActivity,
    cancelJoinNewsActivity,
    getJoinStatus,
    isNewsJoined
  }
}

// 模拟评论 store
export const useCommentHelper = () => {
  const getNewsComments = async (newsId, options = {}) => {
    const { page = 1, size = 10, sort = 'hot' } = options
    // 这里应该调用真实的 API
    return Promise.resolve({
      list: [],
      total: 0,
      hasMore: false,
      stats: {
        total: 0,
        hot: 0,
        new: 0,
        author: 0
      }
    })
  }

  const createComment = async (commentData, newsDetail = null, userInfo = null) => {
    const newComment = {
      id: Date.now(),
      ...commentData,
      createTime: new Date().toISOString(),
      publishTime: new Date().toISOString(),
      likeCount: 0,
      replyCount: 0,
      liked: false,
      userName: userInfo?.name || userInfo?.nickname || '匿名用户',
      userAvatar: userInfo?.avatar || '/static/images/生成动物写实头像.png'
    }
    
    // 保存到我的评论
    if (newsDetail && userInfo) {
      let myComments = uni.getStorageSync('myComments') || []
      // 添加到开头
      myComments.unshift({
        ...newComment,
        newsId: commentData.newsId,
        newsTitle: newsDetail.title,
        content: commentData.content
      })
      // 最多保存100条
      if (myComments.length > 100) {
        myComments.pop()
      }
      uni.setStorageSync('myComments', myComments)
    }
    
    return Promise.resolve(newComment)
  }

  const toggleCommentLike = async (commentId) => {
    const likedComments = uni.getStorageSync('likedComments') || []
    const index = likedComments.indexOf(commentId)
    if (index > -1) {
      likedComments.splice(index, 1)
    } else {
      likedComments.push(commentId)
    }
    uni.setStorageSync('likedComments', likedComments)
    return Promise.resolve()
  }

  return {
    getNewsComments,
    createComment,
    toggleCommentLike
  }
}

// 模拟用户 store
export const useUserHelper = () => {
  const isLoggedIn = () => {
    const token = uni.getStorageSync('token')
    return !!token
  }

  const checkLogin = () => {
    if (!isLoggedIn()) {
      uni.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/user/login'
            })
          }
        }
      })
      return false
    }
    return true
  }

  return {
    isLoggedIn,
    checkLogin
  }
}

// 阅读设置 store
export const useReadingHelper = () => {
  const getSettings = () => {
    return uni.getStorageSync('readingSettings') || {
      fontSize: 32,
      lineHeight: 1.8,
      nightMode: false,
      eyeProtection: false,
      autoScroll: false,
      showReadProgress: true
    }
  }

  const saveSettings = (settings) => {
    uni.setStorageSync('readingSettings', settings)
  }

  const getReadingPosition = (newsId) => {
    const positions = uni.getStorageSync('readingPositions') || {}
    return positions[newsId] || null
  }

  const saveReadingPosition = (record) => {
    const positions = uni.getStorageSync('readingPositions') || {}
    positions[record.newsId] = {
      position: record.position,
      timestamp: record.timestamp
    }
    uni.setStorageSync('readingPositions', positions)
  }

  return {
    getSettings,
    saveSettings,
    getReadingPosition,
    saveReadingPosition
  }
}
