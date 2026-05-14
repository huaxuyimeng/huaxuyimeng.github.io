// types/global.d.ts
// 全局类型定义

// 全局类型声明
declare global {
  // 扩展 Window 对象
  interface Window {
    // 可以在这里添加全局属性
  }
}

// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 分页响应类型
export interface PageResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 分页请求参数
export interface PageParams {
  page?: number
  pageSize?: number
}

// 通用列表响应
export interface ListResponse<T = any> {
  list: T[]
  total: number
}

// 文件上传响应
export interface UploadResponse {
  url: string
  filename: string
  size: number
  type: string
}

// 通用选项类型
export interface OptionItem {
  label: string
  value: string | number
  disabled?: boolean
  children?: OptionItem[]
}

// 通用键值对
export interface KeyValue {
  key: string | number
  value: any
  label?: string
}

// 时间范围
export interface DateRange {
  start: string | Date
  end: string | Date
}

// 坐标信息
export interface Location {
  latitude: number
  longitude: number
  address?: string
  name?: string
}

// 图片信息
export interface ImageInfo {
  url: string
  width?: number
  height?: number
  size?: number
}

// 视频信息
export interface VideoInfo {
  url: string
  duration?: number
  size?: number
  poster?: string
}

export {}

