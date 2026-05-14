// store/modules/activity/state.js
export default {
  activityList: [],
  currentActivity: null,
  myActivities: {
    created: [],
    joined: [],
    favorite: [],
    history: []
  },
  stats: {
    createdCount: 0,
    joinedCount: 0,
    favoriteCount: 0,
    historyCount: 0
  },
  loading: false
}
