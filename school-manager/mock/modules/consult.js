// mock/modules/consult.js - 咨询Mock数据
export function getQuickQuestions() {
  return [
    '如何选课？',
    '图书馆开放时间？',
    '如何申请奖学金？',
    '食堂营业时间？'
  ]
}

export function getMessageHistory() {
  return {
    messages: [
      {
        id: 1,
        role: 'user',
        content: '你好',
        time: new Date().toISOString()
      },
      {
        id: 2,
        role: 'assistant',
        content: '你好！我是校园助手，有什么可以帮助你的吗？',
        time: new Date().toISOString()
      }
    ]
  }
}

