// store/modules/news/actions.js
import { news } from '@/api/index.js'

export default {
  // 获取新闻列表
  async getNewsList({ commit }, params) {
    commit('SET_LOADING', true)
    try {
      const res = await news.getNewsList(params)
      commit('SET_NEWS_LIST', res.list || res || [])
      return res
    } catch (error) {
      console.error('获取新闻列表失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取新闻详情
  async getNewsDetail({ commit }, params) {
    commit('SET_LOADING', true)
    try {
      const res = await news.getNewsDetail(params)
      commit('SET_CURRENT_NEWS', res)
      return res
    } catch (error) {
      console.error('获取新闻详情失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 获取热门新闻
  async getHotNews({ commit }, params) {
    try {
      const res = await news.getHotNews(params)
      return res
    } catch (error) {
      console.error('获取热门新闻失败:', error)
      throw error
    }
  },
  
  // 获取置顶新闻
  async getPinnedNews({ commit }, params) {
    try {
      const res = await news.getPinnedNews(params)
      return res
    } catch (error) {
      console.error('获取置顶新闻失败:', error)
      throw error
    }
  },
  
  // 搜索新闻
  async searchNews({ commit }, params) {
    try {
      const res = await news.searchNews(params)
      return res
    } catch (error) {
      console.error('搜索新闻失败:', error)
      throw error
    }
  },
  
  // 点赞新闻
  async likeNews({ commit, state }, data) {
    try {
      const res = await news.likeNews(data)
      // 更新新闻的点赞状态
      commit('UPDATE_NEWS_LIKE', {
        newsId: data.newsId,
        liked: true,
        likeCount: (state.currentNews?.id === data.newsId ? state.currentNews.likeCount : 0) + 1
      })
      return res
    } catch (error) {
      console.error('点赞失败:', error)
      throw error
    }
  },
  
  // 取消点赞
  async unlikeNews({ commit, state }, data) {
    try {
      const res = await news.unlikeNews(data)
      // 更新新闻的点赞状态
      const currentLikeCount = state.currentNews?.id === data.newsId ? state.currentNews.likeCount : 0
      commit('UPDATE_NEWS_LIKE', {
        newsId: data.newsId,
        liked: false,
        likeCount: Math.max(0, currentLikeCount - 1)
      })
      return res
    } catch (error) {
      console.error('取消点赞失败:', error)
      throw error
    }
  },
  
  // 收藏新闻
  async favoriteNews({ commit }, data) {
    try {
      const res = await news.favoriteNews(data)
      commit('UPDATE_NEWS_FAVORITE', {
        newsId: data.newsId,
        favorited: true
      })
      return res
    } catch (error) {
      console.error('收藏失败:', error)
      throw error
    }
  },
  
  // 取消收藏
  async unfavoriteNews({ commit }, data) {
    try {
      const res = await news.unfavoriteNews(data)
      commit('UPDATE_NEWS_FAVORITE', {
        newsId: data.newsId,
        favorited: false
      })
      return res
    } catch (error) {
      console.error('取消收藏失败:', error)
      throw error
    }
  },
  
  // 获取评论
  async getComments({ commit, state }, params) {
    commit('SET_LOADING_COMMENTS', true)
    try {
      const res = await news.getComments({
        ...params,
        page: params.page || state.currentCommentPage,
        size: params.size || 10,
        sort: params.sort || state.commentSort
      })
      
      // 更新评论列表
      if (params.page === 1 || !params.page) {
        commit('SET_COMMENTS', res.list || res || [])
        commit('SET_COMMENT_PAGE', 1)
      } else {
        commit('ADD_COMMENTS', res.list || res || [])
      }
      
      // 更新统计信息
      if (res.stats) {
        commit('SET_COMMENT_STATS', res.stats)
      }
      
      // 更新分页信息
      commit('SET_HAS_MORE_COMMENTS', res.hasMore !== false)
      commit('SET_COMMENT_PAGE', (params.page || state.currentCommentPage) + 1)
      
      return res
    } catch (error) {
      console.error('获取评论失败:', error)
      throw error
    } finally {
      commit('SET_LOADING_COMMENTS', false)
    }
  },
  
  // 添加评论
  async addComment({ commit, state }, data) {
    try {
      const res = await news.addComment(data)
      
      // 如果是顶级评论，添加到列表
      if (!data.parentId) {
        commit('ADD_COMMENT', res)
      } else {
        // 如果是回复，更新父评论的回复数
        const parentComment = state.comments.find(c => c.id === data.parentId)
        if (parentComment) {
          parentComment.replyCount = (parentComment.replyCount || 0) + 1
          if (!parentComment.replies) {
            parentComment.replies = []
          }
          parentComment.replies.unshift(res)
        }
      }
      
      // 更新评论统计
      commit('SET_COMMENT_STATS', {
        total: (state.commentStats.total || 0) + 1
      })
      
      return res
    } catch (error) {
      console.error('添加评论失败:', error)
      throw error
    }
  },
  
  // 点赞评论
  async likeComment({ commit, state }, { commentId, newsId }) {
    try {
      const comment = state.comments.find(c => c.id === commentId)
      if (!comment) {
        throw new Error('评论不存在')
      }
      
      const liked = !comment.liked
      const likeCount = liked ? (comment.likeCount || 0) + 1 : Math.max(0, (comment.likeCount || 0) - 1)
      
      // 先更新本地状态（乐观更新）
      commit('UPDATE_COMMENT_LIKE', { commentId, liked, likeCount })
      
      // 调用后端API
      if (liked) {
        await news.likeComment({ commentId, newsId })
      } else {
        await news.unlikeComment({ commentId, newsId })
      }
      
      return { success: true }
    } catch (error) {
      console.error('点赞评论失败:', error)
      // 回滚状态
      const comment = state.comments.find(c => c.id === commentId)
      if (comment) {
        const liked = comment.liked
        const likeCount = liked ? Math.max(0, comment.likeCount - 1) : (comment.likeCount || 0) + 1
        commit('UPDATE_COMMENT_LIKE', { commentId, liked: !liked, likeCount })
      }
      throw error
    }
  },
  
  // 删除评论
  async deleteComment({ commit }, data) {
    try {
      const res = await news.deleteComment(data)
      return res
    } catch (error) {
      console.error('删除评论失败:', error)
      throw error
    }
  },
  
  // 记录浏览历史
  async addViewHistory({ commit }, data) {
    try {
      const res = await news.addViewHistory(data)
      // 更新浏览数
      if (data.newsId) {
        commit('UPDATE_NEWS_VIEW_COUNT', {
          newsId: data.newsId,
          viewCount: (this.state.news.currentNews?.viewCount || 0) + 1
        })
      }
      return res
    } catch (error) {
      console.error('记录浏览历史失败:', error)
      // 浏览历史记录失败不应该阻止用户继续操作
      return null
    }
  },
  
  // 获取浏览历史
  async getViewHistory({ commit }, params) {
    try {
      const res = await news.getViewHistory(params)
      return res
    } catch (error) {
      console.error('获取浏览历史失败:', error)
      throw error
    }
  },
  
  // 报名新闻活动
  async joinNewsActivity({ commit }, data) {
    try {
      const res = await news.joinNewsActivity(data)
      return res
    } catch (error) {
      console.error('报名失败:', error)
      throw error
    }
  },
  
  // 取消报名
  async cancelJoinNewsActivity({ commit }, data) {
    try {
      const res = await news.cancelJoinNewsActivity(data)
      return res
    } catch (error) {
      console.error('取消报名失败:', error)
      throw error
    }
  },
  
  // 获取报名状态
  async getJoinStatus({ commit }, params) {
    try {
      const res = await news.getJoinStatus(params)
      return res
    } catch (error) {
      console.error('获取报名状态失败:', error)
      throw error
    }
  },
  
  // 获取相关新闻
  async getRelatedNews({ commit }, params) {
    try {
      const res = await news.getRelatedNews(params)
      const relatedList = res.list || res || []
      commit('SET_RELATED_NEWS', relatedList)
      return res
    } catch (error) {
      console.error('获取相关新闻失败:', error)
      throw error
    }
  },
  
  // 切换评论排序
  async changeCommentSort({ commit, dispatch }, { sort, newsId }) {
    commit('SET_COMMENT_SORT', sort)
    commit('RESET_COMMENTS')
    return await dispatch('getComments', { newsId, page: 1, sort })
  },
  
  // 加载更多评论
  async loadMoreComments({ commit, state, dispatch }, { newsId }) {
    if (state.loadingComments || !state.hasMoreComments) {
      return
    }
    return await dispatch('getComments', {
      newsId,
      page: state.currentCommentPage,
      sort: state.commentSort
    })
  },
  
  // 获取新闻分类
  async getNewsCategories({ commit }, params) {
    try {
      const res = await news.getNewsCategories(params)
      commit('SET_CATEGORIES', res.list || res || [])
      return res
    } catch (error) {
      console.error('获取新闻分类失败:', error)
      throw error
    }
  },
  
  // 按分类获取新闻
  async getNewsByCategory({ commit }, params) {
    try {
      const res = await news.getNewsByCategory(params)
      return res
    } catch (error) {
      console.error('按分类获取新闻失败:', error)
      throw error
    }
  },
  
  // 清除当前新闻
  clearCurrentNews({ commit }) {
    commit('SET_CURRENT_NEWS', null)
  }
}

