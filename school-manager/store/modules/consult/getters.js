// store/modules/consult/getters.js
export default {
  messages: state => state.messages,
  sessions: state => state.sessions,
  currentSession: state => state.currentSession,
  quickQuestions: state => state.quickQuestions,
  loading: state => state.loading
}

