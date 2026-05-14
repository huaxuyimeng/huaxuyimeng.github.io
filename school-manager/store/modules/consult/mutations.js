// store/modules/consult/mutations.js
export default {
  SET_MESSAGES(state, messages) {
    state.messages = messages
  },
  
  ADD_MESSAGE(state, message) {
    state.messages.push(message)
  },
  
  SET_SESSIONS(state, sessions) {
    state.sessions = sessions
  },
  
  SET_CURRENT_SESSION(state, session) {
    state.currentSession = session
  },
  
  SET_QUICK_QUESTIONS(state, questions) {
    state.quickQuestions = questions
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

