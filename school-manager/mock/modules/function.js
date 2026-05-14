// mock/modules/function.js - 功能Mock数据
export function getCanteenList() {
  return {
    list: [
      {
        id: 1,
        name: '第一食堂',
        location: '学生宿舍区',
        openTime: '06:00-22:00',
        queueCount: 15,
        rating: 4.5
      },
      {
        id: 2,
        name: '第二食堂',
        location: '教学区',
        openTime: '07:00-21:00',
        queueCount: 8,
        rating: 4.8
      }
    ]
  }
}

export function getLibraryInfo() {
  return {
    name: '图书馆',
    openTime: '08:00-22:00',
    totalSeats: 500,
    availableSeats: 120,
    totalBooks: 100000,
    borrowingCount: 3
  }
}

