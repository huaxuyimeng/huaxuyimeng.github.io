// mock/modules/activity.js - 活动Mock数据
export function getActivityList() {
  return {
    list: [
      {
        id: 1,
        title: '校园音乐节',
        cover: '/static/images/activity1.jpg',
        status: 'upcoming',
        startTime: '2024-12-20 19:00:00',
        location: '学校大礼堂',
        organizer: '音乐社',
        participants: 15,
        capacity: 100,
        viewCount: 256,
        likeCount: 45,
        commentCount: 12
      },
      {
        id: 2,
        title: '人工智能前沿讲座',
        cover: '/static/images/activity2.jpg',
        status: 'upcoming',
        startTime: '2024-12-18 14:00:00',
        location: '信息楼报告厅',
        organizer: '计算机学院',
        participants: 8,
        capacity: 50,
        viewCount: 189,
        likeCount: 23,
        commentCount: 5
      }
    ],
    total: 2,
    page: 1,
    pageSize: 10
  }
}

export function getActivityDetail() {
  return {
    id: 1,
    title: '校园音乐节',
    cover: '/static/images/activity1.jpg',
    status: 'upcoming',
    description: '一年一度的校园音乐节即将开始，欢迎所有音乐爱好者参与！',
    content: '<p>活动详情内容...</p>',
    startTime: '2024-12-20 19:00:00',
    endTime: '2024-12-20 22:00:00',
    location: '学校大礼堂',
    organizer: {
      id: 1,
      name: '音乐社',
      avatar: '/static/avatars/org1.jpg'
    },
    participants: 15,
    capacity: 100,
    viewCount: 256,
    likeCount: 45,
    commentCount: 12,
    tags: ['音乐', '娱乐', '校园']
  }
}

