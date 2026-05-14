// 从本地存储加载数据
const loadFromStorage = () => {
  try {
    const data = uni.getStorageSync('ai_assistant_store')
    return data || null
  } catch (error) {
    console.error('加载存储数据失败:', error)
    return null
  }
}

// 保存到本地存储
const saveToStorage = (state) => {
  try {
    const dataToSave = {
      messages: state.messages,
      sessions: state.sessions,
      settings: state.settings,
      userInfo: state.userInfo
    }
    uni.setStorageSync('ai_assistant_store', dataToSave)
  } catch (error) {
    console.error('保存到存储失败:', error)
  }
}

// 生成唯一的消息ID
const generateMessageId = () => {
  return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// 生成唯一的会话ID
const generateSessionId = () => {
  return 'session_' + Date.now()
}

// 智能AI回复生成器
const generateAIResponse = (question) => {
  const questionLower = question.toLowerCase()
  
  // 关键词响应映射
  const responses = {
    // 账户相关
    '密码': '修改密码的步骤：\n1. 进入"个人中心"\n2. 点击"设置"\n3. 选择"修改密码"\n4. 输入原密码和新密码\n5. 点击确认完成修改',
    '账号': '账号相关问题：\n• 找回账号：在登录页点击"忘记密码"\n• 修改手机号：个人中心-账号安全\n• 账号冻结：联系客服400-123-4567',
    '登录': '登录遇到问题？\n1. 检查网络连接\n2. 确认账号密码正确\n3. 如忘记密码，点击"忘记密码"\n4. 联系客服获取帮助',
    
    // 功能相关
    '活动': '活动报名：\n1. 在"活动"页面查看活动列表\n2. 选择感兴趣的活动\n3. 点击"立即报名"\n4. 填写相关信息\n5. 确认报名成功',
    '课程表': '查看课程表：\n1. 进入"功能"页面\n2. 点击"课程表"图标\n3. 选择学期和班级\n4. 查看详细课表',
    '打卡': '打卡功能：\n• 每日打卡：功能页面-打卡\n• 查看记录：个人中心-打卡记录\n• 补卡申请：联系管理员',
    '请假': '请假申请：\n1. 功能页面-请假申请\n2. 填写请假信息\n3. 选择审批人\n4. 提交等待审批',
    
    // 校园服务
    '图书馆': '图书馆信息：\n• 开放时间：8:00-22:00\n• 位置：主校区东侧\n• 服务：借阅、自习、电子资源\n• 咨询电话：010-12345678',
    '食堂': '食堂信息：\n• 一食堂：6:30-21:00\n• 二食堂：6:30-20:30\n• 特色窗口：各地风味小吃\n• 支持校园卡/移动支付',
    '宿舍': '宿舍服务：\n• 报修：使用"宿舍报修"小程序\n• 网络：信息中心办理\n• 门禁：23:00-6:00\n• 热水：24小时供应',
    '医疗': '校医院：\n• 工作时间：8:00-17:00\n• 急诊：24小时\n• 地点：校园西北角\n• 电话：010-87654321',
    
    // 系统相关
    '版本': '当前版本：v1.2.0\n最新版本：v1.2.1\n更新内容：\n• 新增AI助手功能\n• 优化界面体验\n• 修复已知问题',
    '更新': '检查更新：\n1. 进入"我的"页面\n2. 点击"关于我们"\n3. 检查更新\n或前往应用商店更新',
    '设置': '系统设置：\n• 通知设置：个人中心-设置\n• 隐私设置：账号与安全\n• 通用设置：应用设置',
    
    // 客服与帮助
    '客服': '客服联系方式：\n• 电话：400-123-4567\n• 邮箱：support@campus.com\n• 在线客服：9:00-18:00\n• 紧急情况：24小时值班',
    '帮助': '获取帮助：\n1. 查看"帮助中心"\n2. 联系在线客服\n3. 提交反馈建议\n4. 拨打客服电话',
    '反馈': '反馈建议：\n1. 我的页面-意见反馈\n2. 描述问题并提交\n3. 可上传截图\n4. 我们会尽快回复',
    
    // 问候语
    '你好': '您好！我是校园AI助手，很高兴为您服务！\n\n我可以帮您解答：\n• 校园生活问题\n• 功能使用指导\n• 系统操作帮助\n• 常见问题咨询\n\n有什么可以帮您的吗？',
    '谢谢': '不客气！为您服务是我的荣幸。😊\n\n如果还有其他问题，随时可以问我哦！',
    '再见': '感谢使用！如果还有其他问题，随时可以回来找我。祝您校园生活愉快！',
  }
  
  // 匹配关键词
  for (const [keyword, response] of Object.entries(responses)) {
    if (question.includes(keyword)) {
      return response
    }
  }
  
  // 模糊匹配
  if (question.includes('如何') || question.includes('怎么')) {
    return `关于"${question}"，我来为您提供帮助：\n\n请尝试以下方式获取更准确的答案：\n1. 查看相关功能的使用说明\n2. 联系对应部门的老师\n3. 咨询在线客服\n4. 查看帮助文档\n\n您也可以告诉我更具体的问题，我会尽力帮您解答。`
  }
  
  if (question.includes('时间') || question.includes('几点')) {
    return '校园各场所开放时间：\n• 图书馆：8:00-22:00\n• 食堂：6:30-21:00\n• 教学楼：7:00-22:00\n• 体育场：6:00-22:00\n• 校医院：8:00-17:00（急诊24小时）'
  }
  
  if (question.includes('地址') || question.includes('在哪')) {
    return '校园主要地点：\n• 行政楼：校园中心\n• 教学楼：东校区\n• 图书馆：西校区\n• 食堂：生活区\n• 宿舍：生活区南北\n• 体育场：西校区\n\n如需具体位置，请查看校园地图。'
  }
  
  // 默认回复
  return `感谢您的提问！关于"${question}"，我目前主要专注于提供以下帮助：\n\n🔸 校园生活服务咨询\n🔸 软件功能使用指导\n🔸 常见问题解答\n🔸 系统操作帮助\n\n如果您有具体的问题，比如：\n• 如何修改密码\n• 图书馆开放时间\n• 活动报名流程\n• 课程表查看方法\n\n我会为您提供详细的解答。您也可以使用快捷提问获取常见问题的答案。`
}

export default {
  namespaced: true,
  
  state: {
    // 消息列表
    messages: [],
    // 会话列表
    sessions: [],
    // 当前会话ID
    currentSessionId: null,
    // 用户信息
    userInfo: {
      name: '',
      avatar: '',
      studentId: '',
      department: '',
      grade: ''
    },
    // 应用状态
    isOnline: true,
    loading: false,
    typing: false,
    // 快捷问题列表
    quickQuestions: [
      { text: '如何修改密码？', icon: '🔐' },
      { text: '版本更新说明', icon: '🔄' },
      { text: '如何使用活动报名？', icon: '📅' },
      { text: '如何查看打卡记录？', icon: '📊' },
      { text: '如何联系客服？', icon: '👨‍💼' },
      { text: '如何修改个人信息？', icon: '👤' },
      { text: '如何找回账号？', icon: '🔍' },
      { text: '如何反馈建议？', icon: '💡' }
    ],
    // 应用设置
    settings: {
      soundEnabled: true,
      autoScroll: true,
      showWelcome: true,
      showTimeDivider: true,
      maxHistory: 100
    }
  },
  
  getters: {
    // 获取当前会话的消息
    currentMessages: (state) => {
      if (!state.currentSessionId) {
        return state.messages.filter(msg => !msg.sessionId || msg.sessionId === 'default')
      }
      return state.messages.filter(msg => msg.sessionId === state.currentSessionId)
    },
    
    // 是否显示欢迎界面
    shouldShowWelcome: (state, getters) => {
      if (!state.settings.showWelcome) return false
      return getters.currentMessages.length <= 1
    },
    
    // 获取用户头像
    userAvatar: (state) => {
      return state.userInfo.avatar || '/static/default-avatar.png'
    },
    
    // 获取用户名
    userName: (state) => {
      return state.userInfo.name || '用户'
    },
    
    // 是否有未读消息
    hasUnreadMessages: (state) => {
      return state.messages.some(msg => !msg.read && msg.type === 'ai')
    },
    
    // 获取所有会话
    allSessions: (state) => {
      return state.sessions.map(session => {
        const sessionMessages = state.messages.filter(msg => msg.sessionId === session.id)
        return {
          ...session,
          lastMessage: sessionMessages[sessionMessages.length - 1],
          unreadCount: sessionMessages.filter(msg => !msg.read && msg.type === 'ai').length
        }
      })
    }
  },
  
  mutations: {
    // 设置消息列表
    SET_MESSAGES(state, messages) {
      state.messages = messages
    },
    
    // 添加消息
    ADD_MESSAGE(state, message) {
      state.messages.push({
        ...message,
        id: message.id || generateMessageId(),
        timestamp: message.timestamp || new Date().toISOString(),
        read: message.type === 'user'
      })
      
      // 限制消息数量
      if (state.messages.length > state.settings.maxHistory) {
        state.messages = state.messages.slice(-state.settings.maxHistory)
      }
    },
    
    // 更新消息
    UPDATE_MESSAGE(state, { id, updates }) {
      const index = state.messages.findIndex(msg => msg.id === id)
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...updates }
      }
    },
    
    // 删除消息
    DELETE_MESSAGE(state, id) {
      state.messages = state.messages.filter(msg => msg.id !== id)
    },
    
    // 设置当前会话
    SET_CURRENT_SESSION(state, sessionId) {
      state.currentSessionId = sessionId
    },
    
    // 添加会话
    ADD_SESSION(state, session) {
      state.sessions.push(session)
    },
    
    // 删除会话
    DELETE_SESSION(state, sessionId) {
      state.sessions = state.sessions.filter(s => s.id !== sessionId)
      state.messages = state.messages.filter(msg => msg.sessionId !== sessionId)
    },
    
    // 更新用户信息
    UPDATE_USER_INFO(state, userInfo) {
      state.userInfo = { ...state.userInfo, ...userInfo }
    },
    
    // 设置网络状态
    SET_NETWORK_STATUS(state, isOnline) {
      state.isOnline = isOnline
    },
    
    // 设置加载状态
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    // 设置打字状态
    SET_TYPING(state, typing) {
      state.typing = typing
    },
    
    // 更新设置
    UPDATE_SETTINGS(state, settings) {
      state.settings = { ...state.settings, ...settings }
    },
    
    // 标记消息为已读
    MARK_MESSAGE_READ(state, id) {
      const message = state.messages.find(msg => msg.id === id)
      if (message) {
        message.read = true
      }
    },
    
    // 标记所有消息为已读
    MARK_ALL_READ(state) {
      state.messages.forEach(msg => {
        msg.read = true
      })
    },
    
    // 清除当前会话消息
    CLEAR_CURRENT_MESSAGES(state) {
      if (state.currentSessionId) {
        state.messages = state.messages.filter(
          msg => msg.sessionId !== state.currentSessionId
        )
      } else {
        // 如果没有当前会话，清除没有会话ID的消息
        state.messages = state.messages.filter(msg => msg.sessionId)
      }
    }
  },
  
  actions: {
    // 初始化AI助手
    async initialize({ commit, dispatch, state, rootState }) {
      try {
        // 检查网络状态
        const networkStatus = await uni.getNetworkType()
        commit('SET_NETWORK_STATUS', networkStatus.networkType !== 'none')
        
        // 加载存储数据
        const storedData = loadFromStorage()
        if (storedData) {
          if (storedData.messages) {
            commit('SET_MESSAGES', storedData.messages)
          }
          if (storedData.sessions) {
            state.sessions = storedData.sessions
          }
          if (storedData.settings) {
            commit('UPDATE_SETTINGS', storedData.settings)
          }
          if (storedData.userInfo) {
            commit('UPDATE_USER_INFO', storedData.userInfo)
          }
        }
        
        // 设置用户信息（从user模块获取）
        if (rootState.user && rootState.user.userInfo) {
          commit('UPDATE_USER_INFO', rootState.user.userInfo)
        }
        
        // 如果没有会话，创建默认会话
        if (state.sessions.length === 0) {
          await dispatch('createNewSession')
        }
        
        // 如果没有当前会话，设置为第一个会话
        if (!state.currentSessionId && state.sessions.length > 0) {
          commit('SET_CURRENT_SESSION', state.sessions[0].id)
        }
        
        return true
      } catch (error) {
        console.error('初始化AI助手失败:', error)
        return false
      }
    },
    
    // 创建新会话
    async createNewSession({ commit, state }) {
      const sessionId = generateSessionId()
      const session = {
        id: sessionId,
        title: '新对话',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      commit('ADD_SESSION', session)
      commit('SET_CURRENT_SESSION', sessionId)
      
      // 添加欢迎消息
      const welcomeMessage = {
        id: 'welcome_' + Date.now(),
        sessionId: sessionId,
        type: 'ai',
        content: '您好！我是校园AI助手，可以回答您关于本软件的问题，有什么可以帮您的吗？',
        read: true
      }
      
      commit('ADD_MESSAGE', welcomeMessage)
      
      // 保存到存储
      saveToStorage(state)
      
      return session
    },
    
    // 发送消息
    async sendMessage({ commit, state, dispatch }, content) {
      if (!content || !content.trim()) {
        return Promise.reject(new Error('消息内容不能为空'))
      }
      
      const messageContent = content.trim()
      
      // 用户消息
      const userMessage = {
        sessionId: state.currentSessionId,
        type: 'user',
        content: messageContent,
        status: 'sending'
      }
      
      commit('ADD_MESSAGE', userMessage)
      
      try {
        // 模拟发送到服务器
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // 更新消息状态
        commit('UPDATE_MESSAGE', {
          id: userMessage.id,
          updates: { status: 'success' }
        })
        
        // 获取AI回复
        await dispatch('getAIResponse', {
          question: messageContent,
          userMessageId: userMessage.id
        })
        
        // 保存到存储
        saveToStorage(state)
        
        return userMessage
      } catch (error) {
        commit('UPDATE_MESSAGE', {
          id: userMessage.id,
          updates: { 
            status: 'error',
            error: error.message 
          }
        })
        throw error
      }
    },
    
    // 获取AI回复
    async getAIResponse({ commit, state }, { question, userMessageId }) {
      commit('SET_TYPING', true)
      
      try {
        // 模拟思考时间
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
        
        // 生成AI回复
        const aiResponse = generateAIResponse(question)
        
        const aiMessage = {
          sessionId: state.currentSessionId,
          type: 'ai',
          content: aiResponse,
          relatedUserMessageId: userMessageId
        }
        
        commit('ADD_MESSAGE', aiMessage)
        commit('SET_TYPING', false)
        
        // 保存到存储
        saveToStorage(state)
        
        return aiMessage
      } catch (error) {
        commit('SET_TYPING', false)
        
        const errorMessage = {
          sessionId: state.currentSessionId,
          type: 'ai',
          content: '抱歉，暂时无法获取回复，请稍后重试。',
          isError: true,
          relatedUserMessageId: userMessageId
        }
        
        commit('ADD_MESSAGE', errorMessage)
        saveToStorage(state)
        
        throw error
      }
    },
    
    // 复制消息
    copyMessage({ state }, messageId) {
      return new Promise((resolve, reject) => {
        const message = state.messages.find(m => m.id === messageId)
        if (!message || !message.content) {
          reject(new Error('消息不存在'))
          return
        }
        
        uni.setClipboardData({
          data: message.content,
          success: () => resolve(true),
          fail: () => reject(new Error('复制失败'))
        })
      })
    },
    
    // 重试消息
    async retryMessage({ commit, state, dispatch }, messageId) {
      const message = state.messages.find(m => m.id === messageId)
      if (!message || message.type !== 'ai' || !message.isError) {
        return
      }
      
      const userMessage = state.messages.find(
        m => m.id === message.relatedUserMessageId
      )
      
      if (userMessage) {
        // 删除错误消息
        commit('DELETE_MESSAGE', messageId)
        
        // 重新获取回复
        await dispatch('getAIResponse', {
          question: userMessage.content,
          userMessageId: userMessage.id
        })
      }
    },
    
    // 点赞消息
    likeMessage({ commit }, messageId) {
      commit('UPDATE_MESSAGE', {
        id: messageId,
        updates: { 
          liked: true,
          disliked: false
        }
      })
    },
    
    // 点踩消息
    dislikeMessage({ commit }, messageId) {
      commit('UPDATE_MESSAGE', {
        id: messageId,
        updates: { 
          liked: false,
          disliked: true
        }
      })
    },
    
    // 切换会话
    switchSession({ commit }, sessionId) {
      commit('SET_CURRENT_SESSION', sessionId)
    },
    
    // 清除聊天记录
    async clearChatHistory({ commit, state, dispatch }) {
      commit('CLEAR_CURRENT_MESSAGES')
      
      // 如果没有消息，添加欢迎消息
      if (state.currentSessionId) {
        const welcomeMessage = {
          sessionId: state.currentSessionId,
          type: 'ai',
          content: '您好！我是校园AI助手，可以回答您关于本软件的问题，有什么可以帮您的吗？',
          read: true
        }
        
        commit('ADD_MESSAGE', welcomeMessage)
      }
      
      // 保存到存储
      saveToStorage(state)
      
      return true
    },
    
    // 删除会话
    deleteSession({ commit, state }, sessionId) {
      commit('DELETE_SESSION', sessionId)
      
      // 如果删除的是当前会话，切换到第一个会话
      if (state.currentSessionId === sessionId && state.sessions.length > 0) {
        commit('SET_CURRENT_SESSION', state.sessions[0].id)
      }
      
      saveToStorage(state)
    },
    
    // 更新设置
    updateSettings({ commit, state }, settings) {
      commit('UPDATE_SETTINGS', settings)
      saveToStorage(state)
    },
    
    // 更新用户信息
    updateUserInfo({ commit, state }, userInfo) {
      commit('UPDATE_USER_INFO', userInfo)
      saveToStorage(state)
    }
  }
}