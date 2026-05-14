// types/utils.d.ts
// 工具函数类型定义

// 存储工具类型
export interface StorageUtil {
  set(key: string, value: any, expired?: number): void
  get<T = any>(key: string, defaultValue?: T): T | null
  remove(key: string): void
  clear(): void
  has(key: string): boolean
  keys(): string[]
}

// 日期工具类型
export interface DateUtil {
  format(date: Date | string | number, format?: string): string
  parse(dateString: string, format?: string): Date | null
  addDays(date: Date | string, days: number): Date
  addMonths(date: Date | string, months: number): Date
  addYears(date: Date | string, years: number): Date
  diff(start: Date | string, end: Date | string, unit?: 'day' | 'month' | 'year'): number
  isToday(date: Date | string): boolean
  isYesterday(date: Date | string): boolean
  isTomorrow(date: Date | string): boolean
  startOfDay(date: Date | string): Date
  endOfDay(date: Date | string): Date
  startOfWeek(date: Date | string): Date
  endOfWeek(date: Date | string): Date
  startOfMonth(date: Date | string): Date
  endOfMonth(date: Date | string): Date
}

// 字符串工具类型
export interface StringUtil {
  trim(str: string): string
  capitalize(str: string): string
  camelCase(str: string): string
  kebabCase(str: string): string
  snakeCase(str: string): string
  truncate(str: string, length: number, suffix?: string): string
  escape(str: string): string
  unescape(str: string): string
  format(template: string, ...args: any[]): string
}

// 数字工具类型
export interface NumberUtil {
  format(num: number, decimals?: number, separator?: string): string
  parse(str: string): number | null
  random(min: number, max: number): number
  clamp(value: number, min: number, max: number): number
  round(value: number, decimals?: number): number
  floor(value: number, decimals?: number): number
  ceil(value: number, decimals?: number): number
}

// 图片工具类型
export interface ImageUtil {
  compress(file: File | string, quality?: number): Promise<File | string>
  resize(file: File | string, width: number, height: number): Promise<File | string>
  getInfo(file: File | string): Promise<{ width: number; height: number; size: number }>
  toBase64(file: File | string): Promise<string>
  fromBase64(base64: string, filename?: string): Promise<File>
}

// 文件工具类型
export interface FileUtil {
  read(file: File | string): Promise<string | ArrayBuffer>
  download(url: string, filename?: string): Promise<void>
  upload(file: File | string, url: string, options?: any): Promise<any>
  getSize(file: File | string): number
  getType(file: File | string): string
  getName(file: File | string): string
}

// 设备工具类型
export interface DeviceUtil {
  getInfo(): Promise<{
    platform: string
    system: string
    version: string
    screenWidth: number
    screenHeight: number
    statusBarHeight: number
  }>
  getNetworkType(): Promise<string>
  isConnected(): Promise<boolean>
  vibrate(duration?: number): void
  setClipboard(data: string): Promise<void>
  getClipboard(): Promise<string>
}

// 权限工具类型
export interface PermissionUtil {
  request(permission: string): Promise<boolean>
  check(permission: string): Promise<boolean>
  openSettings(): void
}

// 认证工具类型
export interface AuthUtil {
  isLoggedIn(): boolean
  getToken(): string | null
  setToken(token: string): void
  removeToken(): void
  getUserInfo(): any
  setUserInfo(userInfo: any): void
  clear(): void
}

// URL 工具类型
export interface UrlUtil {
  parse(url: string): {
    protocol?: string
    host?: string
    port?: string
    path?: string
    query?: Record<string, any>
    hash?: string
  }
  stringify(params: Record<string, any>): string
  build(base: string, params?: Record<string, any>): string
  getQuery(key?: string): any
  setQuery(key: string, value: any): void
  removeQuery(key: string): void
}

// 验证工具类型
export interface ValidateUtil {
  required(value: any, message?: string): boolean | string
  email(value: string, message?: string): boolean | string
  phone(value: string, message?: string): boolean | string
  idCard(value: string, message?: string): boolean | string
  url(value: string, message?: string): boolean | string
  minLength(value: string, min: number, message?: string): boolean | string
  maxLength(value: string, max: number, message?: string): boolean | string
  pattern(value: string, pattern: RegExp, message?: string): boolean | string
  custom(value: any, validator: (value: any) => boolean | string, message?: string): boolean | string
}

// 防抖函数类型
export interface DebounceFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel(): void
  flush(): ReturnType<T> | undefined
}

// 节流函数类型
export interface ThrottleFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel(): void
  flush(): ReturnType<T> | undefined
}

// 事件发射器类型
export interface EventEmitter {
  on(event: string, handler: (...args: any[]) => void): void
  off(event: string, handler?: (...args: any[]) => void): void
  emit(event: string, ...args: any[]): void
  once(event: string, handler: (...args: any[]) => void): void
  clear(): void
}

