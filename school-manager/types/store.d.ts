// types/store.d.ts
// Vuex Store 类型定义

import { UserInfo, Activity, News, Weather, WeatherForecast, ConsultMessage, ConsultHistory, SystemInfo, Statistics } from './api'

// User Store State
export interface UserState {
  token: string | null
  userInfo: UserInfo | null
  profile: UserInfo | null
  loading: boolean
}

// Activity Store State
export interface ActivityState {
  list: Activity[]
  detail: Activity | null
  filter: {
    keyword?: string
    status?: number
    category?: string
    startTime?: string
    endTime?: string
  }
  loading: boolean
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

// News Store State
export interface NewsState {
  list: News[]
  detail: News | null
  categories: string[]
  loading: boolean
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

// Weather Store State
export interface WeatherState {
  current: Weather | null
  forecast: WeatherForecast[]
  city: string
  loading: boolean
}

// Function Store State
export interface FunctionState {
  menu: any[]
  loading: boolean
}

// Consult Store State
export interface ConsultState {
  history: ConsultHistory[]
  messages: ConsultMessage[]
  loading: boolean
  currentHistoryId: string | number | null
}

// System Store State
export interface SystemState {
  systemInfo: SystemInfo | null
  config: Record<string, any>
  statistics: Statistics | null
  loading: boolean
}

// Root Store State
export interface RootState {
  user: UserState
  activity: ActivityState
  news: NewsState
  weather: WeatherState
  function: FunctionState
  consult: ConsultState
  system: SystemState
}

// Store Getters
export interface RootGetters {
  'user/isLoggedIn': boolean
  'user/userInfo': UserInfo | null
  'activity/list': Activity[]
  'activity/detail': Activity | null
  'news/list': News[]
  'news/detail': News | null
  'weather/current': Weather | null
  'system/systemInfo': SystemInfo | null
  [key: string]: any
}

// Store Actions
export interface RootActions {
  'user/login': (params: { username: string; password: string }) => Promise<any>
  'user/logout': () => Promise<void>
  'user/getProfile': () => Promise<any>
  'activity/getList': (params?: any) => Promise<any>
  'activity/getDetail': (id: string | number) => Promise<any>
  'news/getList': (params?: any) => Promise<any>
  'news/getDetail': (id: string | number) => Promise<any>
  'weather/getCurrent': (city?: string) => Promise<any>
  'system/getSystemInfo': () => Promise<any>
  [key: string]: (...args: any[]) => Promise<any>
}

// Store Mutations
export interface RootMutations {
  'user/SET_TOKEN': (token: string | null) => void
  'user/SET_USER_INFO': (userInfo: UserInfo | null) => void
  'activity/SET_LIST': (list: Activity[]) => void
  'news/SET_LIST': (list: News[]) => void
  'weather/SET_CURRENT': (weather: Weather | null) => void
  [key: string]: (...args: any[]) => void
}

